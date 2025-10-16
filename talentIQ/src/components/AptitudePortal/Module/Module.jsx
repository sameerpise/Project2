// ModuleCard.jsx
import React from "react";
import { Card, CardContent, Typography, Divider, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom";

export default function ModuleCard({ title, link, unlocked, completed, gradient }) {
  return (
    <Card
      sx={{
        width: { xs: "95%", sm: "450px" },
        borderRadius: 4,
        backdropFilter: "blur(12px)",
        background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9))",
        boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
        position: "relative",
        transition: "all 0.3s ease",
        opacity: unlocked ? 1 : 0.6,
        pointerEvents: unlocked ? "auto" : "none",
        "&:hover": { transform: "translateY(-6px)" },
      }}
    >
      {completed && (
        <CheckCircleIcon
          sx={{
            color: "#4caf50",
            position: "absolute",
            top: 14,
            right: 14,
            fontSize: 34,
            background: "#fff",
            borderRadius: "50%",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        />
      )}

      {!unlocked && !completed && (
        <LockIcon
          sx={{
            position: "absolute",
            top: 14,
            right: 14,
            color: "gray",
          }}
        />
      )}

      <CardContent sx={{ textAlign: "center", p: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {unlocked ? (
          <Button
            component={Link}
            to={link}
            fullWidth
            sx={{
              mt: 2,
              borderRadius: 3,
              py: 1.2,
              textTransform: "none",
              fontSize: "16px",
              background: gradient,
            }}
            variant="contained"
          >
            Start
          </Button>
        ) : (
          <Typography sx={{ mt: 2, fontSize: 14, color: "gray" }}>
            🔒 Unlock after previous module
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
