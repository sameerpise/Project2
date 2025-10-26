import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

export default function CameraAccess() {
  const videoRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
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
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  if (error) {
    return (
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          p: 2,
          background: "#ffeaea",
          borderRadius: 2,
          border: "1px solid #ff6b6b",
          zIndex: 2000,
        }}
      >
        <Typography color="error" fontSize={13}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 220,
        height: 160,
        borderRadius: 3,
        overflow: "hidden",
        border: "2px solid #1565c0",
        background: "#000",
        zIndex: 2000,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <Typography
        sx={{
          position: "absolute",
          top: 4,
          left: 6,
          fontSize: 12,
          color: "white",
          opacity: 0.7,
          fontWeight: 500,
        }}
      >
        📹 Camera Active
      </Typography>
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
    </Box>
  );
}
