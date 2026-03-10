import React, { useRef, useState, useEffect, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { EMOTIONS, EMOTION_EMOJIS, PLAYLISTS, type Emotion, type SongData } from "@/lib/constants";
import { analyzeEmotion } from "@/services/emotionApi";
import { loadFaceModels } from "@/lib/faceDetection";
import { toast } from "sonner";

export function CapturePage() {
  const { addMoodEntry } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [result, setResult] = useState<{ emotion: Emotion; confidence: number; ageGroup: string } | null>(null);

  const startCamera = useCallback(async () => {
    setCameraError("");
    try {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch (err: any) {
      setCameraError(err.name === "NotAllowedError" ? "Camera permission denied. Allow access in browser settings." : "Camera not found or unavailable.");
      setCameraReady(false);
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    // Pre-load face detection models
    loadFaceModels().catch(() => {});
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setSnapshot(dataUrl);
    setAnalyzing(true);

    try {
      const detection = await analyzeEmotion(canvas);
      if (detection) {
        const res = {
          emotion: detection.emotion as Emotion,
          confidence: detection.confidence,
          ageGroup: detection.ageGroup,
        };
        setResult(res);
        addMoodEntry(res);
        toast.success(`Detected: ${res.emotion} (${Math.round(res.confidence)}%)`);
      } else {
        toast.error("No face detected. Please try again with better lighting and face the camera directly.");
        setSnapshot(null);
      }
    } catch (err) {
      console.error("Detection error:", err);
      toast.error("Detection failed. Please try again.");
      setSnapshot(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const retake = () => {
    setSnapshot(null);
    setResult(null);
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const emotionColorMap: Record<Emotion, string> = {
    happy: "bg-emotion-happy/20 border-emotion-happy/40 text-emotion-happy",
    sad: "bg-emotion-sad/20 border-emotion-sad/40 text-emotion-sad",
    angry: "bg-emotion-angry/20 border-emotion-angry/40 text-emotion-angry",
    fear: "bg-emotion-fear/20 border-emotion-fear/40 text-emotion-fear",
    disgust: "bg-emotion-disgust/20 border-emotion-disgust/40 text-emotion-disgust",
    surprise: "bg-emotion-surprise/20 border-emotion-surprise/40 text-emotion-surprise",
    neutral: "bg-emotion-neutral/20 border-emotion-neutral/40 text-emotion-neutral",
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold">Capture <span className="text-primary">Mood</span></h1>
        <p className="text-muted-foreground mt-1.5 text-sm">Your camera starts automatically — click Capture Mood when ready</p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Camera */}
        <div className="flex-shrink-0 w-[420px] bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse-dot" />
            <span className="text-xs font-semibold">Live Camera</span>
            <span className="text-[11px] text-muted-foreground ml-auto">{cameraReady ? "🟢 Live" : "🔴 No camera"}</span>
          </div>
          <div className="relative">
            <video ref={videoRef} autoPlay playsInline muted className={`w-full block bg-background min-h-[280px] ${snapshot ? "hidden" : ""}`} />
            {snapshot && <img src={snapshot} alt="Captured" className="w-full block" />}
            {!cameraReady && !snapshot && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/75 gap-3 z-10">
                <span className="text-5xl">📷</span>
                <span className="text-sm text-muted-foreground">{cameraError || "Starting camera…"}</span>
                {cameraError && (
                  <button onClick={startCamera} className="px-5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                    Retry Camera
                  </button>
                )}
              </div>
            )}
            {analyzing && (
              <div className="absolute inset-0 bg-background/85 backdrop-blur flex flex-col items-center justify-center gap-4 z-20 rounded-2xl">
                <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin-custom" />
                <span className="text-sm text-muted-foreground">Analyzing your mood…</span>
              </div>
            )}
          </div>
          <div className="px-5 py-4 flex gap-3 justify-center">
            <button onClick={capture} disabled={!cameraReady || !!snapshot}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-8 py-3 rounded-full font-display text-sm font-extrabold hover:scale-[1.04] hover:shadow-[var(--shadow-glow)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all">
              📸 Capture Mood
            </button>
            {snapshot && (
              <button onClick={retake} className="px-5 py-3 rounded-full text-sm font-bold bg-foreground/5 border border-border text-foreground hover:-translate-y-0.5 transition-all">
                🔄 Retake
              </button>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Results */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {result && (
            <div className="bg-card border border-border rounded-2xl p-5 animate-fade-in">
              <h4 className="font-display font-bold mb-3.5">🧠 Detection Result</h4>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-display font-bold border mb-3.5 ${emotionColorMap[result.emotion]}`}>
                <span className="text-xl">{EMOTION_EMOJIS[result.emotion]}</span>
                {result.emotion.charAt(0).toUpperCase() + result.emotion.slice(1)}
              </div>
              <div className="mb-3.5">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Confidence</span>
                  <span>{Math.round(result.confidence)}%</span>
                </div>
                <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000" style={{ width: `${result.confidence}%` }} />
                </div>
              </div>
              <div className="bg-secondary/15 border border-secondary/30 rounded-lg px-3.5 py-2 text-xs text-secondary-foreground">
                👤 Age Group: {result.ageGroup}
              </div>
            </div>
          )}

          {result && <MusicPanel emotion={result.emotion} />}

          {!result && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h4 className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">Tips for Best Results</h4>
              <div className="flex flex-col gap-2.5 text-xs text-muted-foreground">
                <div>💡 Make sure you're in good lighting</div>
                <div>👁️ Look directly at the camera</div>
                <div>😐 Keep your face relaxed and natural</div>
                <div>📐 Center your face in the frame</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MusicPanel({ emotion }: { emotion: Emotion }) {
  const songs = PLAYLISTS[emotion] || PLAYLISTS.neutral;
  const emoji = EMOTION_EMOJIS[emotion];

  const openSpotify = (song: SongData) => {
    window.open(song.spotify, "_blank");
    toast.success(`Opening: ${song.title} on Spotify`);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 animate-fade-in">
      <div className="font-display font-bold text-base mb-3.5 flex items-center gap-2">
        🎵 <span className="text-primary">{emoji} {emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span> Playlist
      </div>
      <div className="bg-primary/5 border border-primary/20 rounded-xl px-3.5 py-3 flex items-center gap-3 mb-3.5">
        <span className="text-sm">🎧</span>
        <span className="text-xs text-muted-foreground">Click any song to open on <span className="text-primary font-semibold">Spotify</span></span>
      </div>
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
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
  );
}
