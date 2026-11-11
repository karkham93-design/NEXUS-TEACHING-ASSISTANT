import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  getDoc,
  setDoc,
  collection,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID if available
export const db = getFirestore(
  app,
  (firebaseConfig as any).firestoreDatabaseId || undefined
);

// Initialize Auth
export const auth = getAuth(app);

// Base Google Auth Provider
const baseProvider = new GoogleAuthProvider();
baseProvider.setCustomParameters({ prompt: 'select_account' });

// Workspace Scopes Provider
export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/chat.spaces.readonly',
  'https://www.googleapis.com/auth/chat.messages.create',
  'https://www.googleapis.com/auth/contacts.readonly',
];

const workspaceProvider = new GoogleAuthProvider();
for (const scope of WORKSPACE_SCOPES) {
  workspaceProvider.addScope(scope);
}
workspaceProvider.setCustomParameters({ prompt: 'select_account' });

// In-memory token management
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const getAccessToken = (): string | null => cachedAccessToken;

export const signInWithGoogle = async (
  useRedirect = false,
  withWorkspaceScopes = false
): Promise<{ user: User; accessToken: string } | null> => {
  const chosenProvider = withWorkspaceScopes ? workspaceProvider : baseProvider;
  try {
    isSigningIn = true;
    if (useRedirect) {
      await signInWithRedirect(auth, chosenProvider);
      return null;
    }

    const result = await signInWithPopup(auth, chosenProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || 'valid_token';
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (err: any) {
    if (err?.code === 'auth/popup-blocked') {
      console.info('Google Sign In notice: Browser blocked popup window. Showing unblock helper.');
    } else if (err?.code === 'auth/popup-closed-by-user') {
      console.info('Google Sign In notice: Popup was closed by user.');
    } else {
      console.warn('Google Sign In notice:', err?.code || err?.message || err);
    }
    throw err;
  } finally {
    isSigningIn = false;
  }
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const initAuthListener = (
  onUserChanged: (user: User | null, token: string | null) => void
) => {
  // Check for redirect return in case signInWithRedirect was triggered
  getRedirectResult(auth)
    .then((result) => {
      if (result) {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          cachedAccessToken = credential.accessToken;
        }
        onUserChanged(result.user, cachedAccessToken);
      }
    })
    .catch((err) => {
      console.info('Redirect credential check notice:', err?.message || err);
    });

  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      cachedAccessToken = null;
      onUserChanged(null, null);
    } else {
      onUserChanged(user, cachedAccessToken);
    }
  });
};

// Firestore Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error Logged:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration or connectivity.');
      return false;
    }
    // Expected if document doesn't exist or permissions
    return true;
  }
}
testFirestoreConnection();
