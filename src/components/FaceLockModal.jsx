"use client";
import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

export default function FaceLockModal({ onUnlock, onSwitchToPin }) {
  const videoRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [statusText, setStatusText] = useState("AI Models load ho rahe hain...");

  // Step 1: Load Face-API models from CDN
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        setStatusText("Camera start ho raha hai...");
      } catch (err) {
        console.error("Model loading error:", err);
        setStatusText("AI models load nahi ho paaye. PIN use karein.");
      }
    };

    loadModels();
  }, []);

  // Step 2: Start Webcam
  useEffect(() => {
    if (!modelsLoaded) return;
    let stream = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
          setStatusText("Kripya apna chehra camera ke samne rakhein...");
        }
      } catch (err) {
        console.error("Camera error:", err);
        setStatusText("Camera access nahi mila!");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [modelsLoaded]);

  // Step 3: Face Detection & Strict Matching (No Auto-Registration)
  useEffect(() => {
    if (!cameraActive || !modelsLoaded) return;

    const interval = setInterval(async () => {
      if (videoRef.current) {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          const currentDescriptor = detection.descriptor;
          const savedFaceJSON = localStorage.getItem("admin_face_descriptor");

          if (!savedFaceJSON) {
            setStatusText("⚠️ Koi Master Face registered nahi hai! Pehle laptop par register karein ya PIN use karein.");
          } else {
            // Saved face data se match karo
            const savedDescriptor = new Float32Array(JSON.parse(savedFaceJSON));
            const distance = faceapi.euclideanDistance(currentDescriptor, savedDescriptor);

            if (distance < 0.45) {
              setStatusText("✅ Face Matched! Welcome Admin.");
              clearInterval(interval);
              setTimeout(() => onUnlock(), 800);
            } else {
              setStatusText("❌ Unauthorized Face! Sirf Admin ka face allowed hai.");
            }
          }
        } else {
          setStatusText("Chehra detect nahi ho raha... samne aayen.");
        }
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [cameraActive, modelsLoaded, onUnlock]);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      backgroundColor: "rgba(15, 23, 42, 0.95)", zIndex: 9999,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px"
    }}>
      <div style={{
        backgroundColor: "#1e293b", padding: "24px", borderRadius: "16px",
        width: "100%", maxWidth: "400px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
      }}>
        <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "bold", marginBottom: "12px" }}>
          👤 Admin Face Lock
        </h2>
        
        <div style={{ 
          width: "100%", height: "260px", backgroundColor: "#0f172a", 
          borderRadius: "12px", overflow: "hidden", marginBottom: "16px", position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
          />
        </div>

        <p style={{ color: "#38bdf8", fontSize: "14px", fontWeight: "500", marginBottom: "16px" }}>
          {statusText}
        </p>

        <button
          onClick={onSwitchToPin}
          style={{
            width: "100%", backgroundColor: "#334155", color: "#fff", border: "none",
            padding: "12px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", cursor: "pointer"
          }}
        >
          🔐 PIN / Password se Login Karein
        </button>
      </div>
    </div>
  );
}