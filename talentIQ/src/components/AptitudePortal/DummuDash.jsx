import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import Sidebar from "../AptitudePortal/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Aptitude from "./Module/Apptitude";
import GD from "./Module/Gd";
import Machine from "./Module/COdeing";

export default function DummuDash() {
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

  const isModuleRoute =
    location.pathname.includes("apti") ||
    location.pathname.includes("gd") ||
    location.pathname.includes("machine");

  const fetchStatus = async () => {
    if (!student?._id) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/results/check/${student._id}`
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
<Box
  sx={{
    display: "flex",
    gap: 4, // space between cards
    mt: 4,
    width: "100%",
  }}
>
  <Box sx={{ flex: 1 }}>
    <Aptitude />
  </Box>
  <Box sx={{ flex: 1 }}>
    <GD unlocked={aptiCompleted} />
  </Box>
  <Box sx={{ flex: 1 }}>
    <Machine unlocked={aptiCompleted} />
  </Box>
</Box>


  );
}
