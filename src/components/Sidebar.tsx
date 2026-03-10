import React from "react";
import { useApp } from "@/context/AppContext";
import { LogoMark } from "@/components/LogoMark";

type Page = "home" | "capture" | "music" | "history" | "account";

const NAV_ITEMS: { id: Page; icon: string; label: string }[] = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "capture", icon: "📷", label: "Capture Mood" },
  { id: "music", icon: "🎶", label: "Music" },
  { id: "history", icon: "📊", label: "History" },
  { id: "account", icon: "⚙️", label: "Account" },
];

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { user, logout } = useApp();

  return (
    <nav className="w-60 flex-shrink-0 bg-sidebar/90 border-r border-sidebar-border flex flex-col p-6 backdrop-blur-xl relative z-20">
      <div className="mb-10">
        <LogoMark size="sm" />
      </div>

      <div className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              currentPage === item.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            }`}
          >
            <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${
              currentPage === item.id ? "bg-primary/15" : "bg-foreground/5"
            }`}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      <button
        onClick={logout}
        className="bg-foreground/5 border border-border rounded-xl p-3 flex items-center gap-2.5 hover:border-primary/30 transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center font-display font-bold text-xs text-foreground flex-shrink-0">
          {user?.username?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="flex-1 overflow-hidden text-left">
          <div className="text-xs font-semibold truncate">{user?.username || "User"}</div>
          <div className="text-[11px] text-muted-foreground">Click to logout</div>
        </div>
        <span className="text-muted-foreground text-sm">→</span>
      </button>
    </nav>
  );
}
