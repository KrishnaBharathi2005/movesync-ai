import React, { useState } from "react";
import { PLAYLISTS, EMOTION_EMOJIS, EMOTIONS, type Emotion, type SongData } from "@/lib/constants";
import { toast } from "sonner";

export function MusicPage() {
  const [selectedMood, setSelectedMood] = useState<Emotion>("happy");
  const songs = PLAYLISTS[selectedMood];

  const openSpotify = (song: SongData) => {
    window.open(song.spotify, "_blank");
    toast.success(`Opening: ${song.title} on Spotify`);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold">Music <span className="text-primary">Suggestions</span></h1>
        <p className="text-muted-foreground mt-1.5 text-sm">Browse mood-based playlists on Spotify</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-bold mb-1.5">Your Mood Playlist</h3>
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold bg-primary/10 border border-primary/20 text-primary">
              {EMOTION_EMOJIS[selectedMood]} {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}
            </span>
          </div>
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {songs.map((song, i) => (
              <button key={i} onClick={() => openSpotify(song)}
                className="bg-foreground/[0.03] border border-border rounded-xl px-3.5 py-3 flex items-center gap-3 hover:bg-primary/5 hover:border-primary/20 transition-all text-left group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-lg flex-shrink-0">
                  {song.icon}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-xs font-semibold truncate">{song.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{song.artist}</div>
                </div>
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-[10px] text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  ▶
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-bold mb-4">Explore by Mood</h3>
          <div className="flex flex-wrap gap-2">
            {EMOTIONS.map((em) => (
              <button key={em} onClick={() => setSelectedMood(em)}
                className={`px-4 py-2 rounded-lg font-display text-xs font-bold border transition-all ${
                  selectedMood === em
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-foreground/5 border-border text-foreground hover:-translate-y-0.5"
                }`}>
                {EMOTION_EMOJIS[em]} {em.charAt(0).toUpperCase() + em.slice(1)}
              </button>
            ))}
          </div>
          <div className="mt-6">
            <h4 className="font-display text-xs text-muted-foreground mb-3 uppercase tracking-wider">Spotify Integration</h4>
            <div className="bg-[hsl(141,73%,48%)]/10 border border-[hsl(141,73%,48%)]/20 rounded-xl p-3.5 text-xs">
              <div className="text-[hsl(141,73%,48%)] font-semibold mb-1.5">🎧 Spotify Connect</div>
              <div className="text-muted-foreground">Click any song to open directly in Spotify. All recommendations link to Spotify search for instant playback.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
