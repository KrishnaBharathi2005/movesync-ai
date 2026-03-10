import React from "react";
import { useApp } from "@/context/AppContext";
import { EMOTION_EMOJIS } from "@/lib/constants";

interface HomePageProps {
  onNavigate: (page: "capture" | "history") => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { user, moodHistory } = useApp();

  const totalCaptures = moodHistory.length;
  const topEmotion = (() => {
    if (!moodHistory.length) return null;
    const counts: Record<string, number> = {};
    moodHistory.forEach((m) => { counts[m.emotion] = (counts[m.emotion] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  })();
  const avgConfidence = moodHistory.length
    ? Math.round(moodHistory.reduce((s, m) => s + m.confidence, 0) / moodHistory.length)
    : 0;

  return (
    <div className="animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-secondary/20 to-primary/10 border border-primary/20 rounded-2xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
        <h1 className="font-display text-3xl font-extrabold relative">
          Hey, <span className="text-primary">{user?.username || "User"}</span>! 👋
        </h1>
        <p className="text-muted-foreground mt-2 relative">Your AI-powered mood music companion is ready.</p>
        <div className="flex gap-3 mt-5 relative">
          <button onClick={() => onNavigate("capture")} className="px-5 py-2.5 rounded-lg font-display text-xs font-bold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:-translate-y-0.5 transition-all">
            📷 Detect My Mood
          </button>
          <button onClick={() => onNavigate("history")} className="px-5 py-2.5 rounded-lg font-display text-xs font-bold bg-foreground/5 border border-border text-foreground hover:-translate-y-0.5 transition-all">
            📊 View History
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {[
          { icon: "🎭", label: "Total Captures", value: totalCaptures.toString() },
          { icon: "😊", label: "Top Emotion", value: topEmotion ? `${EMOTION_EMOJIS[topEmotion as keyof typeof EMOTION_EMOJIS] || "😐"} ${topEmotion}` : "—" },
          { icon: "🎵", label: "Avg Confidence", value: avgConfidence ? `${avgConfidence}%` : "—" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-2">
            <span className="text-2xl">{stat.icon}</span>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</span>
            <span className="font-display text-2xl font-extrabold">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-display font-bold mb-1">How It Works</h3>
        <p className="text-muted-foreground text-sm mb-5">Three steps to sync your mood with the perfect music</p>
        <div className="grid grid-cols-3 gap-5">
          {[
            { icon: "📷", title: "1. Capture", desc: "Take a picture using your webcam" },
            { icon: "🧠", title: "2. Analyze", desc: "AI detects your emotion & age group" },
            { icon: "🎧", title: "3. Listen", desc: "Get personalized Spotify recommendations" },
          ].map((step) => (
            <div key={step.title} className="text-center py-5">
              <div className="text-4xl mb-3">{step.icon}</div>
              <div className="font-display font-bold mb-1.5">{step.title}</div>
              <div className="text-xs text-muted-foreground">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
