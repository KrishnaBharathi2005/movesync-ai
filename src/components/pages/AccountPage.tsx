import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export function AccountPage() {
  const { user, updateProfile, updatePassword } = useApp();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) { toast.error("Username cannot be empty"); return; }
    updateProfile({ username: username.trim() });
    toast.success("Profile updated!");
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPw || !confirmPw) { toast.error("Fill all password fields"); return; }
    if (newPw.length < 6) { toast.error("New password must be at least 6 characters"); return; }
    if (newPw !== confirmPw) { toast.error("Passwords don't match"); return; }
    setLoading(true);
    const err = await updatePassword(newPw);
    setLoading(false);
    if (!err) {
      toast.success("Password changed successfully!");
      setNewPw(""); setConfirmPw("");
    } else {
      toast.error(err);
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold">Account <span className="text-primary">Settings</span></h1>
        <p className="text-muted-foreground mt-1.5 text-sm">Manage your profile and security</p>
      </div>

      {/* Profile */}
      <form onSubmit={saveProfile} className="bg-card border border-border rounded-2xl p-6 mb-5">
        <h3 className="font-display font-bold mb-4">Profile Information</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center font-display font-bold text-2xl text-foreground">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <div className="font-semibold">{user?.username}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
        </div>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Email</label>
            <input type="email" value={email} disabled
              className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-muted-foreground outline-none cursor-not-allowed" />
            <p className="text-[11px] text-muted-foreground mt-1">Email cannot be changed</p>
          </div>
        </div>
        <button type="submit" className="px-6 py-3 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] transition-all">
          Save Changes
        </button>
      </form>

      {/* Password */}
      <form onSubmit={changePassword} className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-display font-bold mb-4">Change Password</h3>
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
        <button type="submit" className="px-6 py-3 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] transition-all">
          Change Password
        </button>
      </form>
    </div>
  );
}
