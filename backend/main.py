"""
MoveSync AI — Python Backend
FastAPI server for emotion detection from facial images.

Run: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import numpy as np
import cv2
from emotion_model import EmotionDetector
from flask import Flask, send_from_directory, request, jsonify
import os

app = Flask(__name__, static_folder="../dist", static_url_path="")

@app.route("/")
def serve():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/detect", methods=["POST"])
def detect_emotion():
    # your emotion detection code here
    emotion = "happy"
    return jsonify({"emotion": emotion})


# serve other frontend routes
@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(app.static_folder, path)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)

app = FastAPI(title="MoveSync AI Backend", version="1.0.0")

# CORS — allow your frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize detector once at startup
detector = EmotionDetector()


class ImageRequest(BaseModel):
    image: str  # Base64-encoded JPEG


class EmotionResponse(BaseModel):
    emotion: str
    confidence: float
    age_group: str


@app.get("/api/health")
def health_check():
    return {"status": "ok", "model_loaded": detector.is_loaded()}


@app.post("/api/detect-emotion", response_model=EmotionResponse)
def detect_emotion(req: ImageRequest):
    try:
        # Decode base64 image
        img_bytes = base64.b64decode(req.image)
        img_array = np.frombuffer(img_bytes, dtype=np.uint8)
        frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if frame is None:
            raise HTTPException(status_code=400, detail="Invalid image data")

        result = detector.detect(frame)

        if result is None:
            raise HTTPException(status_code=422, detail="No face detected in image")

        return EmotionResponse(
            emotion=result["emotion"],
            confidence=result["confidence"],
            age_group=result["age_group"],
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
