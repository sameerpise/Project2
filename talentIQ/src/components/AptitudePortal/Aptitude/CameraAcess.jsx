import React, { useEffect, useRef, useState } from "react";

export default function CameraAccess() {
  const videoRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true, // for camera
          audio: false, // set true if you also want mic
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Camera access denied or not available: " + err.message);
      }
    };

    enableCamera();

    return () => {
      // stop camera when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Camera Preview</h2>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "400px",
            height: "300px",
            border: "2px solid black",
            borderRadius: "8px",
          }}
        />
      )}
    </div>
  );
}
