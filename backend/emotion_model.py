"""
Emotion Detection Model
Uses DeepFace with OpenCV for face detection and emotion/age analysis.
"""

import cv2
import numpy as np

try:
    from deepface import DeepFace
    DEEPFACE_AVAILABLE = True
except ImportError:
    DEEPFACE_AVAILABLE = False
    print("WARNING: deepface not installed. Install with: pip install deepface tf-keras")

# Emotion mapping to match frontend constants
EMOTION_MAP = {
    "happy": "happy",
    "sad": "sad",
    "angry": "angry",
    "fear": "fear",
    "disgust": "disgust",
    "surprise": "surprise",
    "neutral": "neutral",
}

AGE_BUCKETS = [
    (0, 2, "0-2"),
    (3, 6, "4-6"),
    (7, 12, "8-12"),
    (13, 20, "15-20"),
    (21, 32, "25-32"),
    (33, 43, "38-43"),
    (44, 53, "48-53"),
    (54, 100, "60-100"),
]


def get_age_bucket(age: float) -> str:
    age_int = round(age)
    for min_age, max_age, label in AGE_BUCKETS:
        if min_age <= age_int <= max_age:
            return label
    return "25-32"


class EmotionDetector:
    def __init__(self):
        self._loaded = DEEPFACE_AVAILABLE
        # Load OpenCV face detector as fallback
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )

    def is_loaded(self) -> bool:
        return self._loaded

    def detect(self, frame: np.ndarray) -> dict | None:
        """
        Detect emotion and age from a BGR image frame.
        Returns dict with emotion, confidence, age_group or None if no face found.
        """
        if not DEEPFACE_AVAILABLE:
            return self._fallback_detect(frame)

        try:
            results = DeepFace.analyze(
                frame,
                actions=["emotion", "age"],
                enforce_detection=True,
                detector_backend="opencv",
                silent=True,
            )

            # DeepFace returns a list; take the first face
            result = results[0] if isinstance(results, list) else results

            # Get dominant emotion and its confidence
            dominant_emotion = result["dominant_emotion"]
            emotion = EMOTION_MAP.get(dominant_emotion, "neutral")
            confidence = round(result["emotion"][dominant_emotion], 2)

            # Get age bucket
            age = result.get("age", 25)
            age_group = get_age_bucket(age)

            return {
                "emotion": emotion,
                "confidence": confidence,
                "age_group": age_group,
            }

        except Exception as e:
            print(f"DeepFace analysis failed: {e}")
            return self._fallback_detect(frame)

    def _fallback_detect(self, frame: np.ndarray) -> dict | None:
        """Simple fallback: detect face presence, return neutral."""
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            return None

        return {
            "emotion": "neutral",
            "confidence": 50.0,
            "age_group": "25-32",
        }
