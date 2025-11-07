import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function AptitudeInstructions() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0);
  const [startClicked, setStartClicked] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isMobile = useMediaQuery("(max-width:600px)");

  // Countdown logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && startClicked) {
      navigate("/student/apti");
    }
  }, [countdown, startClicked, navigate]);

  // Mouse tracker for light particles
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleStart = () => {
    setStartClicked(true);
    setCountdown(3);
  };

  return (
    <Box
      onMouseMove={handleMouseMove}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        // background: "linear-gradient(135deg, #007bff, #0052d4)",
        background: "linear-gradient(90deg, #f6ae22 0%, #ff7f50 50%, #050505 100%)",
        p: 0,
        m: 0,
      }}
    >
      {/* Floating glossy lights */}
      {[...Array(10)].map((_, i) => {
        const size = Math.random() * 6 + 4;
        const offsetX = (Math.random() - 0.5) * 150;
        const offsetY = (Math.random() - 0.5) * 150;
        return (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              top: mousePos.y + offsetY,
              left: mousePos.x + offsetX,
              transition: "top 0.2s ease, left 0.2s ease",
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Main Content Card */}
      <Paper
        elevation={6}
        sx={{
          maxWidth: 650,
          width: "100%",
          // p: { xs: 2, sm: 3, md: 4 },
          p:2
          borderRadius: 4,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight="bold"
          mb={2}
          sx={{
            background: "linear-gradient(90deg, #007bff, #00b4d8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          📝 Aptitude Test Instructions
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 14, sm: 16 },
            fontWeight: 500,
            color: "#333",
            mb: 3,
          }}
        >
          Prepare to test your skills! Stay focused and give your best shot 💪
        </Typography>

        {/* Instructions List */}
        <List sx={{ textAlign: "left", mb: 3, px: { xs: 1, sm: 2 } }}>
          {[
            "Multiple-choice questions only.",
            "Do not refresh or switch tabs; 3 warnings will auto-submit the test.",
            "Each question has a time limit.",
            "Click 'Start Test' when ready.",
          ].map((text, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircleOutline sx={{ color: "#007bff" }} />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: { xs: 13, sm: 14 },
                  color: "#333",
                }}
                primary={`${index + 1}. ${text}`}
              />
            </ListItem>
          ))}
        </List>

        {/* Countdown */}
        {countdown > 0 && (
          <Typography
            variant={isMobile ? "h2" : "h3"}
            fontWeight="bold"
            sx={{ color: "#007bff", mb: 2 }}
          >
            {countdown}
          </Typography>
        )}

        {/* Start Button */}
        <Button
          variant="contained"
          size={isMobile ? "medium" : "large"}
          sx={{
            background: "linear-gradient(90deg, #007bff, #00b4d8)",
            color: "#fff",
            fontWeight: "bold",
            px: { xs: 3, sm: 5 },
            py: { xs: 1, sm: 1.3 },
            borderRadius: 3,
            transition: "all 0.3s ease",
            fontSize: { xs: 13, sm: 15 },
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 4px 15px rgba(0,123,255,0.4)",
            },
          }}
          onClick={handleStart}
          disabled={startClicked}
        >
          {startClicked ? "Get Ready..." : "Start Test 🚀"}
        </Button>

        {/* Footer */}
        <Typography
          sx={{
            fontSize: { xs: 16, sm: 18 },
            fontWeight: "bold",
            color: "#007bff",
            mt: 3,
          }}
        >
          🎯 All the Best!
        </Typography>
      </Paper>
    </Box>
  );
}
