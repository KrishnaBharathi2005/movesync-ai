import React, { useRef, useState, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import {
  EMOTION_EMOJIS,
  PLAYLISTS,
  type Emotion,
  type SongData
} from "@/lib/constants";
import { analyzeEmotion } from "@/services/emotionApi";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function CapturePage() {

  const { addMoodEntry } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const [snapshot, setSnapshot] = useState<string | null>(null);

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

    await supabase
      .from("mood_history" as any)
      .insert([
        {
          user_id: data.user.id,
          emotion,
          confidence,
          age_group: ageGroup
        }
      ]);

  };

  /* START CAMERA */

  const startCamera = useCallback(async () => {

    try {

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setCameraReady(true);

    } catch (err) {

      console.error(err);
      toast.error("Camera permission denied");

    }

  }, []);

  /* CAPTURE */

  const capture = async () => {

    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg");

    setSnapshot(dataUrl);

    try {

      const detection = await analyzeEmotion(canvas);

      if (!detection) {

        toast.error("No face detected");
        setSnapshot(null);
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

      toast.success(`Detected: ${res.emotion}`);

    } catch (err) {

      console.error(err);
      toast.error("Emotion detection failed");

    }

  };

  const retake = () => {

    setSnapshot(null);
    setResult(null);

  };

  return (

    <div className="animate-fade-in">

      <h1 className="text-3xl font-bold mb-6">
        Capture Mood
      </h1>

      <div className="flex gap-6">

        <div className="w-[420px] border rounded-xl p-4">

          {!cameraReady && (

            <button
              onClick={startCamera}
              className="w-full bg-primary text-white py-3 rounded-lg"
            >
              Start Camera
            </button>

          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full mt-4"
          />

          {snapshot && (
            <img src={snapshot} className="w-full mt-3" />
          )}

          <div className="flex gap-3 mt-4">

            <button
              onClick={capture}
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

                <div className="text-lg">
                  {EMOTION_EMOJIS[result.emotion]} {result.emotion}
                </div>

                <div className="mt-2">
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

/* MUSIC PANEL */

function MusicPanel({ emotion }: { emotion: Emotion }) {

  const songs = PLAYLISTS[emotion] || PLAYLISTS.neutral;

  return (

    <div className="border rounded-xl p-6 mt-4">

      <h3 className="font-bold mb-3">
        Recommended Songs
      </h3>

      {songs.map((song: SongData, i: number) => (

        <button
          key={i}
          onClick={() => window.open(song.spotify)}
          className="flex items-center gap-3 border rounded-lg px-3 py-3 w-full mb-2"
        >

          <div>{song.icon}</div>

          <div className="text-left">
            <div className="font-semibold">{song.title}</div>
            <div className="text-xs opacity-70">{song.artist}</div>
          </div>

        </button>

      ))}

    </div>

  );
}