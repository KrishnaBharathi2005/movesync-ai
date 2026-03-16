import React, { useRef, useState, useEffect, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import {
  EMOTION_EMOJIS,
  PLAYLISTS,
  type Emotion,
  type SongData
} from "@/lib/constants";
import { analyzeEmotion } from "@/services/emotionApi";
import { loadFaceModels } from "@/lib/faceDetection";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function CapturePage() {

  const { addMoodEntry } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const [result, setResult] = useState<{
    emotion: Emotion;
    confidence: number;
    ageGroup: string;
  } | null>(null);

  /* SAVE MOOD */

  const saveMood = async (
    emotion: Emotion,
    confidence: number,
    ageGroup: string
  ) => {

    const { data } = await supabase.auth.getUser();

    if (!data?.user) return;

    const { error } = await supabase
      .from("mood_history" as any)
      .insert([
        {
          user_id: data.user.id,
          emotion: emotion,
          confidence: confidence,
          age_group: ageGroup
        }
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
    }

  };

  /* START CAMERA */

  const startCamera = useCallback(async () => {

    setCameraError("");

    try {

      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }

      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });

      setStream(s);

      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }

      setCameraReady(true);

    } catch (err: any) {

      setCameraError(
        err.name === "NotAllowedError"
          ? "Camera permission denied."
          : "Camera not available."
      );

      setCameraReady(false);

    }

  }, [stream]);

  /* LOAD MODELS */

  useEffect(() => {

    startCamera();
    loadFaceModels().catch(() => {});

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };

  }, [startCamera]);

  /* CAPTURE IMAGE */

  const capture = async () => {

    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg");

    setSnapshot(dataUrl);
    setAnalyzing(true);

    try {

      const detection = await analyzeEmotion(canvas);

      if (!detection) {

        toast.error("No face detected");

        setSnapshot(null);
        setAnalyzing(false);
        return;

      }

      const res = {
        emotion: detection.emotion as Emotion,
        confidence: detection.confidence,
        ageGroup: detection.ageGroup
      };

      setResult(res);

      addMoodEntry(res);

      await saveMood(res.emotion, res.confidence, res.ageGroup);

      toast.success(
        `Detected: ${res.emotion} (${Math.round(res.confidence)}%)`
      );

    } catch (err) {

      console.error(err);

      toast.error("Emotion detection failed");

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
    happy: "bg-green-200 border-green-400 text-green-700",
    sad: "bg-blue-200 border-blue-400 text-blue-700",
    angry: "bg-red-200 border-red-400 text-red-700",
    fear: "bg-purple-200 border-purple-400 text-purple-700",
    disgust: "bg-yellow-200 border-yellow-400 text-yellow-700",
    surprise: "bg-pink-200 border-pink-400 text-pink-700",
    neutral: "bg-gray-200 border-gray-400 text-gray-700"
  };

  return (

    <div className="animate-fade-in">

      <h1 className="text-3xl font-bold mb-6">
        Capture Mood
      </h1>

      <div className="flex gap-6">

        <div className="w-[420px] border rounded-xl overflow-hidden">

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full ${snapshot ? "hidden" : ""}`}
          />

          {snapshot && (
            <img src={snapshot} className="w-full" />
          )}

          <div className="p-4 flex gap-3 justify-center">

            <button
              onClick={capture}
              disabled={!cameraReady || !!snapshot}
              className="px-6 py-2 bg-primary text-white rounded-full"
            >
              Capture
            </button>

            {snapshot && (
              <button
                onClick={retake}
                className="px-6 py-2 border rounded-full"
              >
                Retake
              </button>
            )}

          </div>

          <canvas ref={canvasRef} className="hidden" />

        </div>

        <div className="flex-1">

          {result && (
            <>
              <div className="border rounded-xl p-6">

                <h3 className="font-bold mb-3">
                  Detection Result
                </h3>

                <div
                  className={`inline-flex gap-2 px-4 py-2 rounded-full border ${emotionColorMap[result.emotion]}`}
                >
                  {EMOTION_EMOJIS[result.emotion]} {result.emotion}
                </div>

                <div className="mt-4">
                  Confidence: {Math.round(result.confidence)}%
                </div>

                <div>
                  Age Group: {result.ageGroup}
                </div>

              </div>

              <MusicPanel emotion={result.emotion} />
            </>
          )}

        </div>

      </div>

    </div>

  );

}

function MusicPanel({ emotion }: { emotion: Emotion }) {

  const songs = PLAYLISTS[emotion] || PLAYLISTS.neutral;

  const openSpotify = (song: SongData) => {
    window.open(song.spotify, "_blank");
  };

  return (

    <div className="border rounded-xl p-6 mt-4">

      <h3 className="font-bold mb-3">
        🎵 Recommended Songs
      </h3>

      <div className="flex flex-col gap-3">

        {songs.map((song, i) => (

          <button
            key={i}
            onClick={() => openSpotify(song)}
            className="flex items-center gap-3 border rounded-lg px-3 py-3 hover:bg-primary/10 transition-all"
          >

            <div className="text-lg">
              {song.icon}
            </div>

            <div className="flex-1 text-left">

              <div className="text-sm font-semibold">
                {song.title}
              </div>

              <div className="text-xs text-gray-400">
                {song.artist}
              </div>

            </div>

          </button>

        ))}

      </div>

    </div>
  );
}