/**
 * Client-side integration for Google Workspace APIs using OAuth Bearer tokens.
 * Complies with Google Workspace least privilege and explicit mutation policies.
 */

export interface WorkspaceFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
}

export interface WorkspaceContact {
  resourceName: string;
  displayName: string;
  email: string;
  photoUrl?: string;
}

export interface WorkspaceChatSpace {
  name: string;
  displayName: string;
  type: string;
}

// 1. Google Drive: Create and upload lesson notes / code snippets
export async function createDriveFile(
  accessToken: string,
  title: string,
  content: string,
  mimeType = 'text/plain'
): Promise<{ id: string; name: string }> {
  const metadata = {
    name: title,
    mimeType: 'text/plain',
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', new Blob([content], { type: mimeType }));

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Drive upload failed (${response.status}): ${err}`);
  }

  return response.json();
}

// 2. Gmail: Send formatted lesson summary to student email
export async function sendGmailMessage(
  accessToken: string,
  toEmail: string,
  subject: string,
  bodyContent: string
): Promise<{ id: string }> {
  // Construct RFC 2822 email format
  const emailLines = [
    `To: ${toEmail}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    '',
    bodyContent,
  ];
  const rawEmail = emailLines.join('\r\n');
  const encodedEmail = btoa(unescape(encodeURIComponent(rawEmail)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedEmail }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gmail send failed (${response.status}): ${err}`);
  }

  return response.json();
}

// 3. Google Calendar: Schedule study session
export async function createCalendarStudySession(
  accessToken: string,
  summary: string,
  description: string,
  startDateTime: string,
  endDateTime: string
): Promise<{ id: string; htmlLink: string }> {
  const event = {
    summary,
    description,
    start: {
      dateTime: startDateTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: endDateTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    reminders: {
      useDefault: true,
    },
  };

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Calendar event creation failed (${response.status}): ${err}`);
  }

  return response.json();
}

// 4. Google Tasks: Create learning assignment task
export async function createGoogleTaskItem(
  accessToken: string,
  title: string,
  notes: string,
  dueDateTime?: string
): Promise<{ id: string; title: string }> {
  const taskPayload: any = {
    title,
    notes,
  };
  if (dueDateTime) {
    taskPayload.due = dueDateTime;
  }

  const response = await fetch(
    'https://tasks.googleapis.com/tasks/v1/lists/@default/tasks',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskPayload),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Tasks creation failed (${response.status}): ${err}`);
  }

  return response.json();
}

// 5. Google Chat: List Spaces and Post Message
export async function listChatSpaces(accessToken: string): Promise<WorkspaceChatSpace[]> {
  const response = await fetch('https://chat.googleapis.com/v1/spaces', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return (data.spaces || []).map((s: any) => ({
    name: s.name,
    displayName: s.displayName || 'Direct Message / Space',
    type: s.type || 'SPACE',
  }));
}

export async function sendChatMessage(
  accessToken: string,
  spaceName: string,
  text: string
): Promise<any> {
  const response = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Chat post failed (${response.status}): ${err}`);
  }

  return response.json();
}

// 6. Google Contacts: List study contacts / mentors
export async function listGoogleContacts(accessToken: string): Promise<WorkspaceContact[]> {
  const response = await fetch(
    'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,photos&pageSize=30',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const connections = data.connections || [];
  return connections
    .map((c: any) => ({
      resourceName: c.resourceName,
      displayName: c.names?.[0]?.displayName || 'Anonymous Peer',
      email: c.emailAddresses?.[0]?.value || '',
      photoUrl: c.photos?.[0]?.url,
    }))
    .filter((c: WorkspaceContact) => Boolean(c.email));
}
