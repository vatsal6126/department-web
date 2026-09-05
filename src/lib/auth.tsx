import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from './supabase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  isSupabaseConfigured: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOutAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const adminLoginDomain = import.meta.env.VITE_ADMIN_LOGIN_DOMAIN || 'ldce-admin.local';
const usernameToEmail = (username: string) => {
  const normalized = username.trim().toLowerCase();
  return normalized.includes('@') ? normalized : `${normalized}@${adminLoginDomain}`;
};

async function checkAdmin(userId: string) {
  const { data, error } = await supabase.from('admins').select('enabled').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return data?.enabled === true;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }
    let active = true;
    void supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) throw error;
      if (!active) return;
      setUser(session?.user ?? null);
      setIsAdmin(session?.user ? await checkAdmin(session.user.id) : false);
      setLoading(false);
    }).catch((error) => {
      console.error('Failed to restore Supabase session.', error);
      if (active) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      void checkAdmin(session.user.id)
        .then(setIsAdmin)
        .catch((error) => {
          console.error('Failed to verify administrator access.', error);
          setIsAdmin(false);
        })
        .finally(() => setLoading(false));
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    isAdmin,
    loading,
    isSupabaseConfigured,
    signIn: async (username, password) => {
      if (!isSupabaseConfigured) throw new Error('Supabase is not configured yet.');
      if (username.trim().length < 3) throw new Error('Enter a valid username or email address.');
      const { error } = await supabase.auth.signInWithPassword({ email: usernameToEmail(username), password });
      if (error) throw error;
    },
    signOutAdmin: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
