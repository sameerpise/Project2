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

  // Track mouse position for light animation
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
        bgcolor: "#f4f6f8",
        overflow: "hidden",
        position: "relative",
        p: 0,
      }}
    >
      {/* Floating soft lights */}
      {[...Array(10)].map((_, i) => {
        const size = Math.random() * 4 + 3;
        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 100;
        return (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              top: mousePos.y + offsetY,
              left: mousePos.x + offsetX,
              transition: "top 0.25s ease, left 0.25s ease",
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Compact Instruction Card */}
      <Paper
        elevation={3}
        sx={{
          width: "90%",
          maxWidth: 550,
          p: { xs: 2, sm: 3 },
          borderRadius: 4,
          backgroundColor: "rgba(255,255,255,0.97)",
          textAlign: "center",
          boxShadow: "0 4px 25px rgba(0,0,0,0.1)",
          zIndex: 2,
        }}
      >
        {/* Title */}
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight="bold"
          mb={1.5}
          sx={{
            background: "linear-gradient(90deg, #F6AE22, #FFB84C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          📝 Aptitude Test Instructions
        </Typography>

        {/* Subheading */}
        <Typography
          sx={{
            fontSize: { xs: 13, sm: 15 },
            fontWeight: 500,
            color: "#555",
            mb: 2,
          }}
        >
          Stay calm and focused — you’re just a few steps away from success 💪
        </Typography>

        {/* Instruction List */}
        <List
          sx={{
            textAlign: "left",
            mb: 2,
            px: { xs: 1, sm: 2 },
          }}
        >
          {[
            "All questions are multiple-choice.",
            "Do not refresh or switch tabs during the test.",
            "Each question has a time limit.",
            "Click ‘Start Test’ when ready.",
          ].map((text, index) => (
            <ListItem key={index} sx={{ py: 0.2 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <CheckCircleOutline sx={{ color: "#F6AE22", fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: { xs: 12, sm: 13.5 },
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
            variant={isMobile ? "h3" : "h2"}
            fontWeight="bold"
            sx={{ color: "#F6AE22", mb: 1 }}
          >
            {countdown}
          </Typography>
        )}

        {/* Start Test Button */}
        <Button
          variant="contained"
          size="medium"
          sx={{
            background: "linear-gradient(90deg, #F6AE22, #FFB84C)",
            color: "#fff",
            fontWeight: "bold",
            px: 4,
            py: 1,
            borderRadius: 3,
            fontSize: { xs: 13, sm: 14 },
            transition: "all 0.3s ease",
            "&:hover": { transform: "scale(1.05)" },
          }}
          onClick={handleStart}
          disabled={startClicked}
        >
          {startClicked ? "Get Ready..." : "Start Test 🚀"}
        </Button>

        {/* Footer */}
        <Typography
          sx={{
            fontSize: { xs: 15, sm: 17 },
            fontWeight: "bold",
            color: "#F6AE22",
            mt: 2,
          }}
        >
          🎯 All the Best!
        </Typography>
      </Paper>
    </Box>
  );
}
