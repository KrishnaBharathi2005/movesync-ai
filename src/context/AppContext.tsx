import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from "react";

import type { MoodEntry, UserProfile } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";

interface AppState {
  user: UserProfile | null;
  moodHistory: MoodEntry[];
  isAuthenticated: boolean;
  loading: boolean;

  login: (email: string, password: string) => Promise<string | null>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<string | null>;

  logout: () => Promise<void>;

  addMoodEntry: (entry: Omit<MoodEntry, "id" | "timestamp">) => void;

  updateProfile: (updates: Partial<UserProfile>) => void;

  sendPasswordReset: (email: string) => Promise<string | null>;

  updatePassword: (newPassword: string) => Promise<string | null>;
}

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }

  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<UserProfile | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  /* LOAD SESSION ON START */

  useEffect(() => {

    const loadSession = async () => {

      const { data } = await supabase.auth.getSession();

      const session = data.session;

      if (session?.user) {

        const meta = session.user.user_metadata;

        const profile = {
          username:
            meta?.username ||
            session.user.email?.split("@")[0] ||
            "User",

          email: session.user.email || ""
        };

        setUser(profile);

        const stored = localStorage.getItem(
          `ms_history_${session.user.id}`
        );

        if (stored) {
          try {
            setMoodHistory(JSON.parse(stored));
          } catch {
            setMoodHistory([]);
          }
        }

      }

      setLoading(false);

    };

    loadSession();

  }, []);

  /* AUTH LISTENER */

  useEffect(() => {

    const { data } = supabase.auth.onAuthStateChange(
      async (_event, session) => {

        if (session?.user) {

          const meta = session.user.user_metadata;

          const profile = {
            username:
              meta?.username ||
              session.user.email?.split("@")[0] ||
              "User",

            email: session.user.email || ""
          };

          setUser(profile);

          const stored = localStorage.getItem(
            `ms_history_${session.user.id}`
          );

          if (stored) {
            try {
              setMoodHistory(JSON.parse(stored));
            } catch {
              setMoodHistory([]);
            }
          }

        } else {

          setUser(null);
          setMoodHistory([]);

        }

      }
    );

    return () => {
      data.subscription.unsubscribe();
    };

  }, []);

  /* SAVE HISTORY PER USER */

  useEffect(() => {

    const save = async () => {

      const { data } = await supabase.auth.getSession();

      if (!data.session?.user) return;

      localStorage.setItem(
        `ms_history_${data.session.user.id}`,
        JSON.stringify(moodHistory)
      );
    };

    save();

  }, [moodHistory]);

  /* LOGIN */

  const login = useCallback(async (email: string, password: string) => {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return error ? error.message : null;

  }, []);

  /* REGISTER */

  const register = useCallback(
    async (username: string, email: string, password: string) => {

      const { error } = await supabase.auth.signUp({
        email,
        password,

        options: {
          data: { username },
          emailRedirectTo: window.location.origin
        }
      });

      return error ? error.message : null;
    },
    []
  );

  /* LOGOUT */

  const logout = useCallback(async () => {

    await supabase.auth.signOut();

  }, []);

  /* ADD MOOD ENTRY */

  const addMoodEntry = useCallback(
    (entry: Omit<MoodEntry, "id" | "timestamp">) => {

      const newEntry: MoodEntry = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      };

      setMoodHistory((prev) => [newEntry, ...prev]);

    },
    []
  );

  /* UPDATE PROFILE */

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {

      if (updates.username) {
        await supabase.auth.updateUser({
          data: { username: updates.username }
        });
      }

      setUser((prev) => (prev ? { ...prev, ...updates } : null));

    },
    []
  );

  /* PASSWORD RESET */

  const sendPasswordReset = useCallback(async (email: string) => {

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    return error ? error.message : null;

  }, []);

  /* UPDATE PASSWORD */

  const updatePassword = useCallback(async (newPassword: string) => {

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

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
        updatePassword
      }}
    >
      {children}
    </AppContext.Provider>
  );
}