import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from "@mui/material";
import Sidebar from "./Sidebar";
import { Outlet, useLocation, Link } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSelector } from "react-redux";

export default function AptitudePortal() {
  const location = useLocation();
  const student = useSelector((state) => state.student.student);

  const [loading, setLoading] = useState(true);
  const [modulesStatus, setModulesStatus] = useState({
    apti: false,
    gd: false,
    machine: false,
  });

  const [aptiCompleted, setAptiCompleted] = useState(
    localStorage.getItem("aptiCompleted") === "true"
  );

  // ✅ Check for all module routes (apti, gd, machine)
  const isModuleRoute =
    location.pathname.includes("apti") ||
    location.pathname.includes("gd") ||
    location.pathname.includes("machine");

  // Fetch status
  const fetchStatus = async () => {
    if (!student?._id) return;
    try {
      const res = await fetch(
        `https://project2-bkuo.onrender.com/api/results/check/${student._id}`
      );
      const data = await res.json();
      setModulesStatus({
        apti: !data.allowed,
        gd: !data.allowed,
        machine: !data.allowed,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [student]);

  useEffect(() => {
    const handleStorageChange = () => {
      setAptiCompleted(localStorage.getItem("aptiCompleted") === "true");
      fetchStatus();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#f0f2f5",
        }}
      >
        <CircularProgress
          size={80}
          thickness={4.5}
          sx={{ color: "#667eea", mb: 2 }}
        />
        <Typography variant="h6" sx={{ color: "#555" }}>
          Loading Dashboard...
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ display: "flex", minHeight: "", bgcolor: "#f9fafe" }}>
      {/* {!isModuleRoute && <Sidebar />}  */}

      <Box sx={{ flex: 1, p: isModuleRoute ? 0 : 3 }}>
        {isModuleRoute ? (
          <Outlet />
        ) : (
          <>
            {/* Header */}
            {/* <Box
              sx={{
                mb: 3,
                p: 3,
                borderRadius: 4,
                textAlign: "center",
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                Aptitude Portal
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                Prepare, Practice & Ace All Rounds 🚀
              </Typography>
            </Box> */}

            {/* Modules */}
  <Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    justifyContent: "center",
    alignItems: "stretch", // ensures equal height
    gap: 4,
    mt: 4,
    width: "100%",
    flexWrap: "wrap", // wraps nicely on smaller screens
  }}
>
  {/* Shared card styles */}
  {[
    {
      title: "Aptitude",
      link: "aptii",
      gradient: "linear-gradient(90deg,#ff9966,#ff5e62)",
      unlocked: true,
      completed: aptiCompleted,
      icon: true,
    },
    {
      title: "Group Discussion",
      link: "gd",
      gradient: "linear-gradient(90deg,#43cea2,#185a9d)",
      unlocked: modulesStatus.apti,
      completed: false,
      icon: modulesStatus.apti,
    },
    {
      title: "Machine Coding Round",
      link: "machine",
      gradient: "linear-gradient(90deg,#00b09b,#96c93d)",
      unlocked: modulesStatus.apti,
      completed: false,
      icon: modulesStatus.apti,
    },
  ].map((card, index) => (
    <Card
      key={index}
      sx={{
        width: { xs: "90%", sm: "300px" },
        borderRadius: 4,
        backdropFilter: "blur(12px)",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9))",
        boxShadow: "0 8px 22px rgba(0,0,0,0.1)",
        position: "relative",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%", // equal height cards
        opacity: card.unlocked ? 1 : 0.6,
        pointerEvents: card.unlocked ? "auto" : "none",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Completion / Lock Icons */}
      {card.completed && (
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
      {!card.unlocked && (
        <LockIcon
          sx={{
            position: "absolute",
            top: 14,
            right: 14,
            color: "gray",
          }}
        />
      )}

      {/* Card Content */}
      <CardContent sx={{ textAlign: "center", p: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          {card.title}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {card.unlocked ? (
          <Button
            component={Link}
            to={card.link}
            fullWidth
            sx={{
              mt: 2,
              borderRadius: 3,
              py: 1.2,
              textTransform: "none",
              fontSize: "16px",
              background: card.gradient,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              },
            }}
            variant="contained"
          >
            Start
          </Button>
        ) : (
          <Typography sx={{ mt: 2, fontSize: 14, color: "gray" }}>
            🔒 Unlock after Aptitude
          </Typography>
        )}
      </CardContent>
    </Card>
  ))}
</Box>

          </>
        )}
      </Box>
    </Box>
  );
}
