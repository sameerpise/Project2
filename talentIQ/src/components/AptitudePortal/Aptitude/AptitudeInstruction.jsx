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
        bgcolor: "#f0f2f5",
        overflow: "hidden",
        position: "relative",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Floating lights */}
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

      {/* Single Main Paper */}
      <Paper
        elevation={10}
        sx={{
          maxWidth: 700,
          width: "100%",
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: 4,
          backgroundColor: "rgba(255,255,255,0.95)",
          textAlign: "center",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          zIndex: 1,
        }}
      >
        {/* Header */}
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

        {/* Illustration */}
        <Box
          component="img"
          src="https://cdn.dribbble.com/users/458522/screenshots/16285384/media/07dbbe09cb19b7e646d4b7a91fc7c161.png?resize=400x300&vertical=center"
          alt="All the Best"
          sx={{
            width: { xs: "80%", sm: "60%", md: "50%" },
            maxWidth: 350,
            mb: { xs: 2, sm: 3 },
            borderRadius: 2,
            objectFit: "contain",
          }}
        />

        {/* Motivational Text */}
        <Typography
          sx={{
            fontSize: { xs: 14, sm: 16, md: 18 },
            fontWeight: 500,
            color: "#444",
            mb: { xs: 2, sm: 3 },
          }}
        >
          Prepare to test your skills! Stay focused and give your best shot 💪
        </Typography>

        {/* Instructions */}
        <List sx={{ textAlign: "left", mb: 3, px: { xs: 1, sm: 2 } }}>
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

        {/* Countdown */}
        {countdown > 0 && (
          <Typography
            variant={isMobile ? "h2" : "h3"}
            fontWeight="bold"
            sx={{ color: "#F6AE22", mb: 2 }}
          >
            {countdown}
          </Typography>
        )}
        

        {/* Start Button */}
        <Button
          variant="contained"
          size={isMobile ? "medium" : "large"}
          sx={{
            background: "linear-gradient(90deg, #F6AE22, #FFB84C)",
            color: "#fff",
            fontWeight: "bold",
            px: { xs: 3, sm: 5 },
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

        {/* All the Best Footer */}
        <Typography
          sx={{
            fontSize: { xs: 16, sm: 18, md: 20 },
            fontWeight: "bold",
            color: "#F6AE22",
            mt: { xs: 2, sm: 3 },
          }}
        >
          🎯 All the Best!
        </Typography>
      </Paper>
    </Box>
  );
}
