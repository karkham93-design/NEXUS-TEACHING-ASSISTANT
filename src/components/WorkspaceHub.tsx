import React, { useState, useEffect } from 'react';
import {
  FileText,
  Mail,
  Calendar,
  CheckSquare,
  MessageSquare,
  Users,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import {
  createDriveFile,
  sendGmailMessage,
  createCalendarStudySession,
  createGoogleTaskItem,
  listChatSpaces,
  sendChatMessage,
  listGoogleContacts,
  WorkspaceContact,
  WorkspaceChatSpace,
} from '../lib/workspace';

interface WorkspaceHubProps {
  accessToken: string | null;
  userEmail?: string | null;
  currentLessonTitle: string;
  currentLessonNotes: string;
}

export const WorkspaceHub: React.FC<WorkspaceHubProps> = ({
  accessToken,
  userEmail,
  currentLessonTitle,
  currentLessonNotes,
}) => {
  const [activeTab, setActiveTab] = useState<'drive' | 'gmail' | 'calendar' | 'tasks' | 'chat' | 'contacts'>('drive');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Form states
  const [driveFileName, setDriveFileName] = useState<string>(`NEXUS_Lesson_${currentLessonTitle.replace(/\s+/g, '_')}.txt`);
  const [gmailSubject, setGmailSubject] = useState<string>(`NEXUS Study Summary: ${currentLessonTitle}`);
  const [gmailRecipient, setGmailRecipient] = useState<string>(userEmail || '');
  const [calendarSummary, setCalendarSummary] = useState<string>(`Study Drill: ${currentLessonTitle}`);
  const [taskTitle, setTaskTitle] = useState<string>(`Complete coding drill for: ${currentLessonTitle}`);
  const [chatMessage, setChatMessage] = useState<string>(`Hey team! Just mastered "${currentLessonTitle}" on NEXUS AI Teaching Assistant. Highly recommend the syllabus & exam breakdown!`);
  const [chatSpaces, setChatSpaces] = useState<WorkspaceChatSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [contacts, setContacts] = useState<WorkspaceContact[]>([]);

  // Confirmation Modal state for mutating/external operations (Mandatory per Skill)
  const [confirmationData, setConfirmationData] = useState<{
    actionTitle: string;
    description: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    setDriveFileName(`NEXUS_Lesson_${currentLessonTitle.replace(/\s+/g, '_')}.txt`);
    setGmailSubject(`NEXUS Study Summary: ${currentLessonTitle}`);
    setCalendarSummary(`Study Drill: ${currentLessonTitle}`);
    setTaskTitle(`Complete coding drill for: ${currentLessonTitle}`);
    if (userEmail && !gmailRecipient) {
      setGmailRecipient(userEmail);
    }
  }, [currentLessonTitle, userEmail]);

  useEffect(() => {
    if (accessToken && activeTab === 'chat' && chatSpaces.length === 0) {
      listChatSpaces(accessToken).then((spaces) => {
        setChatSpaces(spaces);
        if (spaces.length > 0) setSelectedSpace(spaces[0].name);
      });
    }
    if (accessToken && activeTab === 'contacts' && contacts.length === 0) {
      listGoogleContacts(accessToken).then((c) => setContacts(c));
    }
  }, [accessToken, activeTab]);

  if (!accessToken) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center text-slate-300">
        <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
        <h4 className="font-semibold text-white mb-1">Google Workspace Integrations</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Sign in with Google above to export study notes to Drive, send Gmail progress reports, schedule Calendar sessions, create Google Tasks, and chat with peers.
        </p>
      </div>
    );
  }

  // 1. Export to Google Drive
  const handleDriveExport = () => {
    setConfirmationData({
      actionTitle: 'Save Study Notes to Google Drive',
      description: `Create a new document titled "${driveFileName}" in your Google Drive root folder with your latest lesson notes and code examples.`,
      onConfirm: async () => {
        setLoading(true);
        setStatus(null);
        try {
          const res = await createDriveFile(accessToken, driveFileName, currentLessonNotes);
          setStatus({ type: 'success', message: `Successfully saved to Google Drive (ID: ${res.id})!` });
        } catch (e: any) {
          setStatus({ type: 'error', message: e.message || 'Drive export failed.' });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // 2. Send Gmail Summary
  const handleGmailSend = () => {
    if (!gmailRecipient) {
      setStatus({ type: 'error', message: 'Recipient email is required.' });
      return;
    }

    setConfirmationData({
      actionTitle: 'Send Lesson Recap via Gmail',
      description: `Send an email from your Gmail account to "${gmailRecipient}" with subject "${gmailSubject}" containing the complete concept summary and code explanation.`,
      onConfirm: async () => {
        setLoading(true);
        setStatus(null);
        try {
          const bodyHtml = `
            <div style="font-family: sans-serif; max-width: 600px; color: #1e293b;">
              <h2 style="color: #0891b2;">NEXUS AI Teaching Assistant - Study Recap</h2>
              <h3>${currentLessonTitle}</h3>
              <p>Here are your study notes and key takeaways generated during your interactive session with NEXUS AI Teaching Assistant:</p>
              <pre style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-family: monospace;">${currentLessonNotes}</pre>
              <p style="font-size: 12px; color: #64748b;">Generated with NEXUS AI Teaching Assistant • UNEB Curriculum</p>
            </div>
          `;
          await sendGmailMessage(accessToken, gmailRecipient, gmailSubject, bodyHtml);
          setStatus({ type: 'success', message: `Recap email sent via Gmail to ${gmailRecipient}!` });
        } catch (e: any) {
          setStatus({ type: 'error', message: e.message || 'Gmail sending failed.' });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // 3. Calendar Study Session
  const handleCalendarSchedule = () => {
    setConfirmationData({
      actionTitle: 'Schedule Study Session on Google Calendar',
      description: `Add a 1-hour study event titled "${calendarSummary}" to your primary Google Calendar starting tomorrow at 10:00 AM.`,
      onConfirm: async () => {
        setLoading(true);
        setStatus(null);
        try {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(10, 0, 0, 0);
          const end = new Date(tomorrow);
          end.setHours(11, 0, 0, 0);

          await createCalendarStudySession(
            accessToken,
            calendarSummary,
            `Review revision concepts and challenges for ${currentLessonTitle} with NEXUS AI Teaching Assistant`,
            tomorrow.toISOString(),
            end.toISOString()
          );
          setStatus({ type: 'success', message: 'Study session scheduled on your Google Calendar!' });
        } catch (e: any) {
          setStatus({ type: 'error', message: e.message || 'Calendar scheduling failed.' });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // 4. Google Tasks
  const handleCreateTask = () => {
    setConfirmationData({
      actionTitle: 'Create Item in Google Tasks',
      description: `Create a new task titled "${taskTitle}" in your primary Google Tasks list.`,
      onConfirm: async () => {
        setLoading(true);
        setStatus(null);
        try {
          await createGoogleTaskItem(
            accessToken,
            taskTitle,
            `Review key algorithms and pass quiz for ${currentLessonTitle}`
          );
          setStatus({ type: 'success', message: 'Task added to your Google Tasks!' });
        } catch (e: any) {
          setStatus({ type: 'error', message: e.message || 'Task creation failed.' });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // 5. Google Chat Post
  const handlePostChat = () => {
    const targetSpace = selectedSpace || (chatSpaces[0] ? chatSpaces[0].name : '');
    if (!targetSpace) {
      setStatus({ type: 'error', message: 'No Google Chat space found. Join or create a Chat space first.' });
      return;
    }

    setConfirmationData({
      actionTitle: 'Post Message to Google Chat',
      description: `Post the message to your selected Google Chat space (${targetSpace}).`,
      onConfirm: async () => {
        setLoading(true);
        setStatus(null);
        try {
          await sendChatMessage(accessToken, targetSpace, chatMessage);
          setStatus({ type: 'success', message: 'Message posted to Google Chat space!' });
        } catch (e: any) {
          setStatus({ type: 'error', message: e.message || 'Chat post failed.' });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <h3 className="font-semibold text-white">Google Workspace Hub</h3>
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'drive', label: 'Drive', icon: FileText },
            { id: 'gmail', label: 'Gmail', icon: Mail },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
            { id: 'tasks', label: 'Tasks', icon: CheckSquare },
            { id: 'chat', label: 'Chat', icon: MessageSquare },
            { id: 'contacts', label: 'Contacts', icon: Users },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id as any);
                  setStatus(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === t.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {status && (
        <div
          className={`mb-4 text-xs rounded p-2.5 flex items-center gap-2 ${
            status.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-800/60 text-rose-300'
          }`}
        >
          {status.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{status.message}</span>
        </div>
      )}

      {/* Tab 1: Drive */}
      {activeTab === 'drive' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Export study notes and interactive code snippets directly to your Google Drive.
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Target File Name:</label>
            <input
              type="text"
              value={driveFileName}
              onChange={(e) => setDriveFileName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white"
            />
          </div>
          <button
            onClick={handleDriveExport}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            <span>Export Notes to Google Drive</span>
          </button>
        </div>
      )}

      {/* Tab 2: Gmail */}
      {activeTab === 'gmail' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Send an interactive progress summary and lesson notes to your email via Gmail.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">To Email:</label>
              <input
                type="email"
                value={gmailRecipient}
                onChange={(e) => setGmailRecipient(e.target.value)}
                placeholder="youremail@example.com"
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Subject:</label>
              <input
                type="text"
                value={gmailSubject}
                onChange={(e) => setGmailSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
          <button
            onClick={handleGmailSend}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            <span>Send Study Summary via Gmail</span>
          </button>
        </div>
      )}

      {/* Tab 3: Google Calendar */}
      {activeTab === 'calendar' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Schedule an algorithmic drill or review session directly onto your Google Calendar.
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Event Summary:</label>
            <input
              type="text"
              value={calendarSummary}
              onChange={(e) => setCalendarSummary(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white"
            />
          </div>
          <button
            onClick={handleCalendarSchedule}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
            <span>Schedule on Google Calendar</span>
          </button>
        </div>
      )}

      {/* Tab 4: Google Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Create an assignment or study homework checklist item in your Google Tasks.
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Task Title:</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white"
            />
          </div>
          <button
            onClick={handleCreateTask}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
            <span>Add to Google Tasks</span>
          </button>
        </div>
      )}

      {/* Tab 5: Google Chat */}
      {activeTab === 'chat' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Share study questions or lesson milestones with your team in Google Chat.
          </p>
          {chatSpaces.length > 0 ? (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Choose Space:</label>
              <select
                value={selectedSpace}
                onChange={(e) => setSelectedSpace(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white"
              >
                {chatSpaces.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.displayName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-xs text-slate-500 italic">
              No active Google Chat spaces found for your account. You can still compose and verify.
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Message:</label>
            <textarea
              rows={2}
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white"
            />
          </div>
          <button
            onClick={handlePostChat}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
            <span>Post to Google Chat</span>
          </button>
        </div>
      )}

      {/* Tab 6: Google Contacts */}
      {activeTab === 'contacts' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Find peers and study partners from your Google Contacts to collaborate on lessons.
          </p>
          {contacts.length === 0 ? (
            <div className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded border border-slate-800">
              No contacts retrieved from your Google account.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {contacts.map((c, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-xs">
                    {c.displayName[0] || 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-medium text-white truncate">{c.displayName}</div>
                    <div className="text-[11px] text-slate-400 truncate">{c.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mandatory User Confirmation Dialog per Workspace Skill */}
      {confirmationData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-md w-full shadow-2xl text-slate-200">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-2">
              <ShieldAlert className="w-5 h-5" />
              <span>Confirm Google Workspace Operation</span>
            </div>
            <h4 className="text-base font-bold text-white mb-2">{confirmationData.actionTitle}</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              {confirmationData.description}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmationData(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const onConf = confirmationData.onConfirm;
                  setConfirmationData(null);
                  await onConf();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md"
              >
                Confirm &amp; Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
