import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux"; // assuming you store logged-in student in Redux
import { useNavigate } from "react-router-dom";

export default function GD() {
  const [loading, setLoading] = useState(true);
  const [eligible, setEligible] = useState(false);
  const student = useSelector((state) => state.student?.student);
  const navigate = useNavigate();
  const passingScore = 20;

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        if (!student?._id) {
          navigate("/login");
          return;
        }

        // Fetch student’s result
        const res = await fetch(`https://project2-f2lk.onrender.com/api/results/student/${student._id}`);
        const data = await res.json();

        if (data && data.score >= passingScore) {
          setEligible(true);
        } else {
          setEligible(false);
          navigate("/dashboard"); // redirect if failed
        }
      } catch (err) {
        console.error(err);
        navigate("/error");
      } finally {
        setLoading(false);
      }
    };

    checkEligibility();
  }, [student, navigate]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    eligible && (
      <Box
        sx={{
          p: 4,
          minHeight: "100vh",
          background: "linear-gradient(to top, #c7e7ff, #ffffff)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{ color: "#1976d2", fontWeight: "bold", mb: 2 }}
        >
          Welcome to the Group Discussion Round 🎯
        </Typography>
        <Typography sx={{ fontSize: "1.1rem", color: "#333", maxWidth: 600, textAlign: "center" }}>
          Congratulations! You have successfully cleared the aptitude test.  
          Please wait for further instructions or join the scheduled GD session.
        </Typography>
      </Box>
    )
  );
}
