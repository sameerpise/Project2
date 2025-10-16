import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockResetIcon from "@mui/icons-material/LockReset";
import LoginpageImage from "../../assets/LoginPage.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dummy API call simulation
    try {
      if (!email) throw new Error("Email is required");

      // Replace with your real API endpoint
      // const res = await fetch("http://localhost:5000/api/students/forgot-password", {...});
      // const data = await res.json();
      setSuccess(`Password reset link sent to ${email}`);
      setError("");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to top, #f7c86a, #ffffff)",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: 4,
          overflow: "hidden",
          maxWidth: 900,
          width: "100%",
        }}
      >
        {/* Left Side - Form */}
        <Box sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
          <LockResetIcon sx={{ fontSize: 60, color: "#f44336", mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Forgot Password
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Enter your email address and we’ll send you a link to reset your password.
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Enter your email"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: "gray" }} />,
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#f44336",
                color: "white",
                py: 1.2,
                borderRadius: 3,
                mb: 2,
                "&:hover": { backgroundColor: "#d32f2f" },
              }}
            >
              Send Reset Link
            </Button>
          </form>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Remembered your password?{" "}
            <Typography
              component="span"
              color="error"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => window.location.href = "/login"}
            >
              Sign in
            </Typography>
          </Typography>
        </Box>

        {/* Right Side - Image */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#f5f7fa",
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          <img
            src={LoginpageImage}
            alt="Forgot Password Illustration"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
