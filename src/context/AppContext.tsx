import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { MoodEntry, UserProfile } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";

interface AppState {
  user: UserProfile | null;
  moodHistory: MoodEntry[];
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (username: string, email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  addMoodEntry: (entry: Omit<MoodEntry, "id" | "timestamp">) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  sendPasswordReset: (email: string) => Promise<string | null>;
  updatePassword: (newPassword: string) => Promise<string | null>;
}

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        setUser({
          username: meta?.username || session.user.email?.split("@")[0] || "User",
          email: session.user.email || "",
        });
        // Load history for this user
        const histStr = localStorage.getItem(`ms_history_${session.user.id}`);
        if (histStr) {
          try { setMoodHistory(JSON.parse(histStr)); } catch { setMoodHistory([]); }
        }
      } else {
        setUser(null);
        setMoodHistory([]);
      }
      setLoading(false);
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        setUser({
          username: meta?.username || session.user.email?.split("@")[0] || "User",
          email: session.user.email || "",
        });
        const histStr = localStorage.getItem(`ms_history_${session.user.id}`);
        if (histStr) {
          try { setMoodHistory(JSON.parse(histStr)); } catch { setMoodHistory([]); }
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Persist history when it changes
  useEffect(() => {
    const saveHistory = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && moodHistory.length > 0) {
        localStorage.setItem(`ms_history_${session.user.id}`, JSON.stringify(moodHistory));
      }
    };
    saveHistory();
  }, [moodHistory]);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  }, []);

  const register = useCallback(async (username: string, email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
            },
    });
    return error ? error.message : null;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const addMoodEntry = useCallback((entry: Omit<MoodEntry, "id" | "timestamp">) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setMoodHistory((prev) => [newEntry, ...prev]);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (updates.username) {
      await supabase.auth.updateUser({ data: { username: updates.username } });
    }
    setUser((prev) => prev ? { ...prev, ...updates } : null);
  }, []);

  const sendPasswordReset = useCallback(async (email: string): Promise<string | null> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
    });
    return error ? error.message : null;
  }, []);

  const updatePassword = useCallback(async (newPassword: string): Promise<string | null> => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return error ? error.message : null;
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        moodHistory,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        addMoodEntry,
        updateProfile,
        sendPasswordReset,
        updatePassword,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
