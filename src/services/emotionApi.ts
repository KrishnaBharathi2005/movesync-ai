/**
 * Emotion API Service Layer
 * 
 * Calls an external Python backend for emotion detection.
 * Falls back to local face-api.js if the backend is unavailable.
 */

import { detectEmotion as localDetectEmotion } from "@/lib/faceDetection";
import type { DetectionResult } from "@/lib/faceDetection";

// Set this to your Python backend URL (e.g., "http://localhost:8000" or your deployed URL)
const API_BASE_URL = import.meta.env.VITE_EMOTION_API_URL || "";

interface ApiEmotionResponse {
  emotion: string;
  confidence: number;
  age_group: string;
}

/**
 * Convert canvas to base64 JPEG string (without the data URL prefix)
 */
function canvasToBase64(canvas: HTMLCanvasElement): string {
  const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
  return dataUrl.split(",")[1]; // Remove "data:image/jpeg;base64," prefix
}

/**
 * Call the external Python API for emotion detection
 */
async function callPythonApi(canvas: HTMLCanvasElement): Promise<DetectionResult> {
  const base64Image = canvasToBase64(canvas);

  const response = await fetch(`${API_BASE_URL}/api/detect-emotion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`API error [${response.status}]: ${errBody}`);
  }

  const data: ApiEmotionResponse = await response.json();

  return {
    emotion: data.emotion,
    confidence: data.confidence,
    ageGroup: data.age_group,
  };
}

/**
 * Detect emotion — tries external Python API first, falls back to local face-api.js
 */
export async function analyzeEmotion(canvas: HTMLCanvasElement): Promise<DetectionResult | null> {
  // If no API URL configured, use local detection directly
  if (!API_BASE_URL) {
    return localDetectEmotion(canvas);
  }

  try {
    return await callPythonApi(canvas);
  } catch (err) {
    console.warn("Python API unavailable, falling back to local detection:", err);
    return localDetectEmotion(canvas);
  }
}
