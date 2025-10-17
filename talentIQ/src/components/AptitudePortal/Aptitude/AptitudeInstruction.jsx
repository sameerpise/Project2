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

  // Track mouse position
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleStart = () => {
    setStartClicked(true);
    setCountdown(3); // 3-second countdown
  };

  return (
    <Box
      onMouseMove={handleMouseMove}
      sx={{
        margin: "auto",
        width: "100%",
        maxWidth: 600,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        minHeight: "100vh",
        position: "relative",
        p: { xs: 1, sm: 2, md: 3 },
        bgcolor: "#f0f2f5",
      }}
    >
      {/* Interactive particles */}
      {[...Array(12)].map((_, i) => {
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
              background: "rgba(255,255,255,0.3)",
              top: mousePos.y + offsetY,
              left: mousePos.x + offsetX,
              transition: "top 0.2s ease, left 0.2s ease",
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Paper Container */}
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          textAlign: "center",
          boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight="bold"
          mb={2}
          sx={{
            background: "linear-gradient(90deg, #F6AE22, #FFB84C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          📝 Aptitude Test Instructions
        </Typography>

        <Typography
          variant="body2"
          mb={2}
          sx={{ fontSize: { xs: 12, sm: 14, md: 15 }, color: "#555" }}
        >
          Read the instructions carefully before starting:
        </Typography>

        <List sx={{ textAlign: "left", mb: 3, px: { xs: 0, sm: 1 } }}>
          {[
            "Multiple-choice questions only.",
            "Do not refresh or switch tabs; 3 warnings will auto-submit the test.",
            "Each question has a time limit.",
            "Click 'Start Test' when ready.",
          ].map((text, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircleOutline sx={{ color: "#F6AE22" }} />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: { xs: 12, sm: 13, md: 14 },
                }}
                primary={`${index + 1}. ${text}`}
              />
            </ListItem>
          ))}
        </List>

        {countdown > 0 && (
          <Typography
            variant={isMobile ? "h2" : "h3"}
            fontWeight="bold"
            sx={{
              color: "#F6AE22",
              mb: 2,
            }}
          >
            {countdown}
          </Typography>
        )}

        <Button
          variant="contained"
          size={isMobile ? "medium" : "large"}
          sx={{
            background: "linear-gradient(90deg, #F6AE22, #FFB84C)",
            color: "#fff",
            fontWeight: "bold",
            px: { xs: 2, sm: 4 },
            py: { xs: 1, sm: 1.5 },
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            transition: "all 0.3s ease",
            fontSize: { xs: 12, sm: 14, md: 15 },
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
            },
          }}
          onClick={handleStart}
          disabled={startClicked}
        >
          {startClicked ? "Get Ready..." : "Start Test 🚀"}
        </Button>
      </Paper>
    </Box>
  );
}
