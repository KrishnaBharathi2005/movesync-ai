import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BackgroundOrbs } from "@/components/BackgroundOrbs";
import { LogoMark } from "@/components/LogoMark";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const ResetPassword = () => {
  const { updatePassword } = useApp();
  const navigate = useNavigate();
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Check if this is a recovery flow from the URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newPw || !confirmPw) { setError("Fill all fields"); return; }
    if (newPw.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (newPw !== confirmPw) { setError("Passwords don't match"); return; }

    setLoading(true);
    const err = await updatePassword(newPw);
    setLoading(false);

    if (err) {
      setError(err);
    } else {
      setSuccess(true);
      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/"), 2000);
    }
  };

  return (
    <div className="h-screen overflow-hidden relative">
      <BackgroundOrbs />
      <div className="fixed inset-0 flex items-center justify-center p-6 z-10">
        <form onSubmit={submit} className="animate-slide-up bg-card/85 border border-border backdrop-blur-xl rounded-3xl p-12 w-full max-w-[440px]">
          <div className="flex justify-center mb-8"><LogoMark /></div>

          {success ? (
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="font-display text-2xl font-bold mb-2">Password Updated!</h2>
              <p className="text-sm text-muted-foreground mb-6">Redirecting you to the app…</p>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl font-bold text-center mb-1">Set New Password</h2>
              <p className="text-muted-foreground text-center mb-8 text-sm">Enter your new password below</p>

              {error && <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive mb-4">{error}</div>}

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">New Password</label>
                  <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min 6 characters"
                    className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Confirm New Password</label>
                  <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Re-enter new password"
                    className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] active:translate-y-0 transition-all disabled:opacity-50">
                {loading ? "Updating…" : "Update Password"}
              </button>

              <button type="button" onClick={() => navigate("/")}
                className="w-full py-3.5 mt-2.5 rounded-xl font-display font-bold text-sm bg-transparent border border-border text-foreground hover:border-primary hover:text-primary transition-all">
                Back to Sign In
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
