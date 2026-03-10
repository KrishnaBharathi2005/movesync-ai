import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { LogoMark } from "@/components/LogoMark";
import { toast } from "sonner";

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
        <ForgotForm onSwitch={setScreen} sendReset={sendPasswordReset} />
      )}
    </div>
  );
}

function LoginForm({ onSwitch, onLogin }: { onSwitch: (s: Screen) => void; onLogin: (email: string, pw: string) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !pw) { setError("Please fill all fields"); return; }
    setLoading(true);
    await onLogin(email, pw);
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="animate-slide-up bg-card/85 border border-border backdrop-blur-xl rounded-3xl p-12 w-full max-w-[440px]">
      <div className="flex justify-center mb-8"><LogoMark /></div>
      <h2 className="font-display text-2xl font-bold text-center mb-1">Welcome Back</h2>
      <p className="text-muted-foreground text-center mb-8 text-sm">Sign in to sync your mood with music</p>
      {error && <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive mb-4">{error}</div>}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
            className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Password</label>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Enter password"
            className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] active:translate-y-0 transition-all disabled:opacity-50">
        {loading ? "Signing in…" : "Sign In"}
      </button>
      <button type="button" onClick={() => onSwitch("forgot")} className="w-full py-3.5 mt-2.5 rounded-xl font-display font-bold text-sm bg-transparent border border-border text-foreground hover:border-primary hover:text-primary transition-all">
        Forgot Password?
      </button>
      <p className="text-center mt-6 text-sm text-muted-foreground">
        New here? <button type="button" onClick={() => onSwitch("register")} className="text-primary font-medium hover:underline">Create an account</button>
      </p>
    </form>
  );
}

function RegisterForm({ onSwitch, onRegister }: { onSwitch: (s: Screen) => void; onRegister: (u: string, e: string, p: string) => Promise<void> }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !email || !pw) { setError("Please fill all fields"); return; }
    if (pw.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    await onRegister(username, email, pw);
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="animate-slide-up bg-card/85 border border-border backdrop-blur-xl rounded-3xl p-12 w-full max-w-[440px]">
      <div className="flex justify-center mb-8"><LogoMark /></div>
      <h2 className="font-display text-2xl font-bold text-center mb-1">Create Account</h2>
      <p className="text-muted-foreground text-center mb-8 text-sm">Start your mood-music journey today</p>
      {error && <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive mb-4">{error}</div>}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username"
            className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
            className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Password</label>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Min 6 characters"
            className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] active:translate-y-0 transition-all disabled:opacity-50">
        {loading ? "Creating…" : "Create Account"}
      </button>
      <p className="text-center mt-6 text-sm text-muted-foreground">
        Already have an account? <button type="button" onClick={() => onSwitch("login")} className="text-primary font-medium hover:underline">Sign in</button>
      </p>
    </form>
  );
}

function ForgotForm({ onSwitch, sendReset }: { onSwitch: (s: Screen) => void; sendReset: (email: string) => Promise<string | null> }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!email) { toast.error("Enter your email address"); return; }
    setLoading(true);
    const err = await sendReset(email);
    setLoading(false);
    if (err) {
      toast.error(err);
    } else {
      setSent(true);
      toast.success("Password reset link sent to your email!");
    }
  };

  return (
    <div className="animate-slide-up bg-card/85 border border-border backdrop-blur-xl rounded-3xl p-12 w-full max-w-[440px]">
      <div className="flex justify-center mb-8"><LogoMark /></div>
      <h2 className="font-display text-2xl font-bold text-center mb-1">Reset Password</h2>
      <p className="text-muted-foreground text-center mb-8 text-sm">
        {sent ? "Check your email for the reset link" : "We'll send a reset link to your email"}
      </p>

      {sent ? (
        <div className="text-center">
          <div className="text-5xl mb-4">📧</div>
          <p className="text-sm text-muted-foreground mb-6">
            We've sent a password reset link to <span className="text-primary font-semibold">{email}</span>. 
            Click the link in your email to set a new password.
          </p>
          <button onClick={() => onSwitch("login")} className="w-full py-3.5 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] active:translate-y-0 transition-all">
            Back to Sign In
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
              className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <button onClick={submit} disabled={loading}
            className="w-full py-3.5 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] active:translate-y-0 transition-all disabled:opacity-50">
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
          <button onClick={() => onSwitch("login")} className="w-full py-3.5 mt-2.5 rounded-xl font-display font-bold text-sm bg-transparent border border-border text-foreground hover:border-primary hover:text-primary transition-all">
            Back to Sign In
          </button>
        </>
      )}
    </div>
  );
}
