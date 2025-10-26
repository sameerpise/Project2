import React, { useEffect, useRef, useState } from "react";

export default function DraggableCamera() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [error, setError] = useState("");
  const [pos, setPos] = useState({ x: 10, y: 10 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        setError("Camera access denied or unavailable: " + err.message);
      }
    };
    enableCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
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
    setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: pos.y,
        left: pos.x,
        width: "120px",
        height: "100px",
        borderRadius: "8px",
        overflow: "hidden",
        zIndex: 9999,
        cursor: "grab",
        backgroundColor: "#000",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      // Touch support for mobile
      onTouchStart={(e) => {
        const touch = e.touches[0];
        setDragging(true);
        setOffset({ x: touch.clientX - pos.x, y: touch.clientY - pos.y });
      }}
      onTouchMove={(e) => {
        if (!dragging) return;
        const touch = e.touches[0];
        setPos({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
      }}
      onTouchEnd={() => setDragging(false)}
    >
      {error ? (
        <p style={{ color: "red", fontSize: "12px" }}>{error}</p>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </div>
  );
}
