import React, { createContext, useState, useContext, useEffect } from 'react';
import supabase from '../config/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Derived state
  const emailVerified = user?.email_confirmed_at ? true : false;

  useEffect(() => {
    // 1. Check existing session on mount
    const initSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    initSession();

    // 2. Listen for auth state changes (login, logout, token refresh, email verification)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Sign up with email + password ──
  const signUp = async (email, password, displayName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName || '',
        },
      },
    });

    if (error) throw error;
    return data;
  };

  // ── Sign in with email + password ──
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  // ── Sign in with Google OAuth (future — when GCP billing is sorted) ──
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/app`,
      },
    });

    if (error) throw error;
    return data;
  };

  // ── Resend verification email ──
  const resendVerification = async () => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user?.email,
    });

    if (error) throw error;
  };

  // ── Log out ──
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  };

  // Helper: get display name from user metadata or email
  const getDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || '';
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      emailVerified,
      signUp,
      signIn,
      signInWithGoogle,
      resendVerification,
      logout,
      getDisplayName,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
