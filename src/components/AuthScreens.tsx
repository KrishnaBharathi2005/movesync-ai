import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { LogoMark } from "@/components/LogoMark";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AuthScreensProps {
  onAuthenticated: () => void;
}

type Screen = "login" | "register" | "forgot";

export function AuthScreens({ onAuthenticated }: AuthScreensProps) {
  const [screen, setScreen] = useState<Screen>("login");
  const { login, register, sendPasswordReset } = useApp();

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 z-10">

      {screen === "login" && (
        <LoginForm
          onSwitch={setScreen}
          onLogin={async (email, pw) => {
            const err = await login(email, pw);

            if (err) {
              toast.error(err);
            } else {
              toast.success("Welcome back!");
              onAuthenticated();
            }
          }}
        />
      )}

      {screen === "register" && (
        <RegisterForm
          onSwitch={setScreen}
          onRegister={async (u, e, p) => {
            const err = await register(u, e, p);

            if (err) {
              toast.error(err);
            } else {
              toast.success("Account created! Check your email to confirm.");
            }
          }}
        />
      )}

      {screen === "forgot" && (
        <ForgotForm
          onSwitch={setScreen}
          sendReset={sendPasswordReset}
        />
      )}

    </div>
  );
}

/* GOOGLE LOGIN */

function GoogleLoginButton() {

  const handleGoogleLogin = async () => {

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full py-3.5 rounded-xl font-display font-bold text-sm bg-white text-black flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        width="18"
      />
      Continue with Google
    </button>
  );
}

/* LOGIN FORM */

function LoginForm({
  onSwitch,
  onLogin
}: {
  onSwitch: (s: Screen) => void;
  onLogin: (email: string, pw: string) => Promise<void>;
}) {

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {

    e.preventDefault();
    setError("");

    if (!email || !pw) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    await onLogin(email, pw);

    setLoading(false);
  };

  return (
    <form
      onSubmit={submit}
      className="animate-slide-up bg-card/85 border border-border backdrop-blur-xl rounded-3xl p-12 w-full max-w-[440px]"
    >

      <div className="flex justify-center mb-8">
        <LogoMark />
      </div>

      <h2 className="font-display text-2xl font-bold text-center mb-1">
        Welcome Back
      </h2>

      <p className="text-muted-foreground text-center mb-8 text-sm">
        Sign in to sync your mood with music
      </p>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4 mb-6">

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3"
        />

      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>

      <div className="text-center text-xs text-muted-foreground my-4">
        OR
      </div>

      <GoogleLoginButton />

      <button
        type="button"
        onClick={() => onSwitch("forgot")}
        className="w-full mt-3 text-sm text-primary"
      >
        Forgot Password?
      </button>

      <p className="text-center mt-6 text-sm text-muted-foreground">
        New here?{" "}
        <button
          type="button"
          onClick={() => onSwitch("register")}
          className="text-primary"
        >
          Create an account
        </button>
      </p>

    </form>
  );
}

/* REGISTER FORM */

function RegisterForm({
  onSwitch,
  onRegister
}: {
  onSwitch: (s: Screen) => void;
  onRegister: (u: string, e: string, p: string) => Promise<void>;
}) {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {

    e.preventDefault();
    setError("");

    if (!username || !email || !pw) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    await onRegister(username, email, pw);

    setLoading(false);
  };

  return (
    <form
      onSubmit={submit}
      className="animate-slide-up bg-card/85 border border-border backdrop-blur-xl rounded-3xl p-12 w-full max-w-[440px]"
    >

      <div className="flex justify-center mb-8">
        <LogoMark />
      </div>

      <h2 className="font-display text-2xl font-bold text-center mb-1">
        Create Account
      </h2>

      <div className="space-y-4 mb-6">

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3"
        />

      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground"
      >
        {loading ? "Creating…" : "Create Account"}
      </button>

      <div className="text-center text-xs text-muted-foreground my-4">
        OR
      </div>

      <GoogleLoginButton />

      <p className="text-center mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => onSwitch("login")}
          className="text-primary"
        >
          Sign in
        </button>
      </p>

    </form>
  );
}

/* FORGOT PASSWORD */

function ForgotForm({
  onSwitch,
  sendReset
}: {
  onSwitch: (s: Screen) => void;
  sendReset: (email: string) => Promise<string | null>;
}) {

  const [email, setEmail] = useState("");

  const submit = async () => {

    if (!email) {
      toast.error("Enter your email");
      return;
    }

    const err = await sendReset(email);

    if (err) {
      toast.error(err);
    } else {
      toast.success("Password reset email sent!");
      onSwitch("login");
    }
  };

  return (
    <div className="bg-card p-10 rounded-2xl w-full max-w-[420px]">

      <h2 className="text-xl font-bold mb-4 text-center">
        Reset Password
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 mb-4"
      />

      <button
        onClick={submit}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground"
      >
        Send Reset Link
      </button>

      <button
        onClick={() => onSwitch("login")}
        className="w-full mt-3 text-sm text-primary"
      >
        Back to Login
      </button>

    </div>
  );
}