import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOutAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const adminLoginDomain = import.meta.env.VITE_ADMIN_LOGIN_DOMAIN || 'ldce-admin.local';

function usernameToAuthEmail(username: string) {
  return `${username.trim().toLowerCase()}@${adminLoginDomain}`;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const adminSnapshot = await getDoc(doc(db, 'admins', nextUser.uid));
      setIsAdmin(adminSnapshot.exists() && adminSnapshot.data().enabled === true);
      setLoading(false);
    });
  }, []);

  const value: AuthContextType = {
    user,
    isAdmin,
    loading,
    signIn: async (username, password) => {
      if (!isFirebaseConfigured) {
        throw new Error('Firebase is not configured yet.');
      }
      if (!/^[a-z0-9][a-z0-9._-]{2,31}$/.test(username.trim().toLowerCase())) {
        throw new Error('Username must be 3-32 characters and use only letters, numbers, dots, underscores, or hyphens.');
      }
      await signInWithEmailAndPassword(auth, usernameToAuthEmail(username), password);
    },
    signOutAdmin: () => signOut(auth),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
