import React, { useEffect, useRef, useState } from "react";

export default function DraggableCamera() {
  const videoRef = useRef(null);
  const [error, setError] = useState("");
  const [pos, setPos] = useState({ x: 10, y: 10 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const isMobile = window.innerWidth <= 768;
  const cameraWidth = isMobile ? 80 : 150;
  const cameraHeight = isMobile ? 70 : 120;
  const bottomMargin = isMobile ? 100 : 0;

  useEffect(() => {
    const enableCamera = async () => {
      try {
        // Request permission
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true; // 🔇 required for autoplay
          await videoRef.current.play().catch((err) => console.log("Autoplay blocked:", err));
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Camera access denied or unavailable: " + err.message);
      }
    };

    enableCamera();

    // Stop camera when component unmounts
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };
  const handleMouseMove = (e) => {
    if (!dragging) return;
    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;
    setPos({
      x: Math.min(Math.max(0, newX), window.innerWidth - cameraWidth),
      y: Math.min(Math.max(0, newY), window.innerHeight - cameraHeight - bottomMargin),
    });
  };
  const handleMouseUp = () => setDragging(false);

  return (
    <div
      style={{
        position: "fixed",
        top: pos.y,
        left: pos.x,
        width: `${cameraWidth}px`,
        height: `${cameraHeight}px`,
        borderRadius: "10px",
        overflow: "hidden",
        zIndex: 9999,
        cursor: "grab",
        backgroundColor: "#000",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        setDragging(true);
        setOffset({ x: touch.clientX - pos.x, y: touch.clientY - pos.y });
      }}
      onTouchMove={(e) => {
        if (!dragging) return;
        const touch = e.touches[0];
        const newX = touch.clientX - offset.x;
        const newY = touch.clientY - offset.y;
        setPos({
          x: Math.min(Math.max(0, newX), window.innerWidth - cameraWidth),
          y: Math.min(Math.max(0, newY), window.innerHeight - cameraHeight - bottomMargin),
        });
      }}
      onTouchEnd={() => setDragging(false)}
    >
      {error ? (
        <p
          style={{
            color: "red",
            fontSize: "12px",
            textAlign: "center",
            padding: "8px",
          }}
        >
          {error}
        </p>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
}
