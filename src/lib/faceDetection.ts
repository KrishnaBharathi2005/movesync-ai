import * as faceapi from "face-api.js";

let modelsLoaded = false;
let loadingPromise: Promise<void> | null = null;

const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model/";

export async function loadFaceModels(): Promise<void> {
  if (modelsLoaded) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
  })();

  return loadingPromise;
}

export type DetectionResult = {
  emotion: string;
  confidence: number;
  ageGroup: string;
};

const AGE_BUCKETS = [
  { min: 0, max: 2, label: "0-2" },
  { min: 3, max: 6, label: "4-6" },
  { min: 7, max: 12, label: "8-12" },
  { min: 13, max: 20, label: "15-20" },
  { min: 21, max: 32, label: "25-32" },
  { min: 33, max: 43, label: "38-43" },
  { min: 44, max: 53, label: "48-53" },
  { min: 54, max: 100, label: "60-100" },
];

function getAgeBucket(age: number): string {
  for (const bucket of AGE_BUCKETS) {
    if (age >= bucket.min && age <= bucket.max) return bucket.label;
  }
  return "25-32";
}

export async function detectEmotion(
  canvas: HTMLCanvasElement
): Promise<DetectionResult | null> {
  await loadFaceModels();

  const detection = await faceapi
    .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.3 }))
    .withFaceExpressions()
    .withAgeAndGender();

  if (!detection) return null;

  const expressions = detection.expressions;
  const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
  const [topEmotion, topScore] = sorted[0];

  // Map face-api expression names to our emotion names
  const emotionMap: Record<string, string> = {
    happy: "happy",
    sad: "sad",
    angry: "angry",
    fearful: "fear",
    disgusted: "disgust",
    surprised: "surprise",
    neutral: "neutral",
  };

  const emotion = emotionMap[topEmotion] || "neutral";
  const confidence = Math.round(topScore * 10000) / 100;
  const ageGroup = getAgeBucket(Math.round(detection.age));

  return { emotion, confidence, ageGroup };
}
