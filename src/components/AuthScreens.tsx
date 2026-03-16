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
    <div className="fixed inset-0 flex items-center justify-center p-6">

      {screen === "login" && (
        <LoginForm
          onSwitch={setScreen}
          onLogin={async (email, pw) => {

            const err = await login(email, pw);

            if (err) {
              toast.error(err);
              return;
            }

            toast.success("Welcome back!");

            onAuthenticated();
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
              return;
            }

            toast.success("Account created! Check email to confirm.");
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

  const loginGoogle = async () => {

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) toast.error(error.message);
  };

  return (
    <button
      type="button"
      onClick={loginGoogle}
      className="w-full py-3 rounded-xl bg-white text-black flex justify-center items-center gap-2 hover:bg-gray-100 transition"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        width="18"
      />
      Continue with Google
    </button>
  );
}

/* INPUT STYLE (REUSED) */

const inputStyle =
  "w-full bg-black/40 border border-border rounded-xl px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary";

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, pw);
  };

  return (

    <form
      onSubmit={submit}
      className="bg-card border border-border rounded-2xl p-10 w-full max-w-[420px]"
    >

      <div className="flex justify-center mb-6">
        <LogoMark />
      </div>

      <h2 className="text-xl font-bold text-center mb-6">
        Welcome Back
      </h2>

      <div className="space-y-4 mb-4">

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className={inputStyle}
        />

      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-primary text-white hover:opacity-90 transition"
      >
        Sign In
      </button>

      <div className="text-center text-xs my-4 text-muted-foreground">
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

      <p className="text-center mt-6 text-sm">
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRegister(username, email, pw);
  };

  return (

    <form
      onSubmit={submit}
      className="bg-card border border-border rounded-2xl p-10 w-full max-w-[420px]"
    >

      <h2 className="text-xl font-bold text-center mb-6">
        Create Account
      </h2>

      <div className="space-y-4 mb-4">

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className={inputStyle}
        />

      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-primary text-white hover:opacity-90 transition"
      >
        Create Account
      </button>

      <div className="text-center text-xs my-4 text-muted-foreground">
        OR
      </div>

      <GoogleLoginButton />

      <p className="text-center mt-6 text-sm">
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

    const err = await sendReset(email);

    if (err) {
      toast.error(err);
    } else {
      toast.success("Password reset email sent!");
      onSwitch("login");
    }

  };

  return (

    <div className="bg-card border border-border rounded-2xl p-10 w-full max-w-[420px]">

      <h2 className="text-xl font-bold text-center mb-6">
        Reset Password
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputStyle + " mb-4"}
      />

      <button
        onClick={submit}
        className="w-full py-3 rounded-xl bg-primary text-white"
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