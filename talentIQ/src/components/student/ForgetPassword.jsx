import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import LockResetIcon from "@mui/icons-material/LockReset";
import LoginpageImage from "../../assets/LoginPage.png"; // 🖼️ make sure this path is correct

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ✅ Step 1: Verify Mobile
  const handleVerify = async () => {
    try {
      const res = await fetch(
        "https://project2-f2lk.onrender.com/api/students/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUserId(data.id);
      setStep(2);
      setSuccess("User verified! Now set your new password.");
      setError("");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  // ✅ Step 2: Reset Password
  const handleReset = async () => {
    try {
      const res = await fetch(
        `https://project2-f2lk.onrender.com/api/students/reset-password/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess("Password updated successfully! Redirecting...");
      setError("");
      setTimeout(() => navigate("/login"), 1500);
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
            {step === 1
              ? "Enter your registered mobile number to verify your account."
              : "Set a strong new password for your account."}
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {step === 1 ? (
            <>
              <TextField
                fullWidth
                label="Registered Mobile"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                InputProps={{
                  startAdornment: (
                    <SmartphoneIcon sx={{ mr: 1, color: "gray" }} />
                  ),
                }}
                sx={{ mb: 3 }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#f44336",
                  color: "white",
                  py: 1.2,
                  borderRadius: 3,
                  "&:hover": { backgroundColor: "#d32f2f" },
                }}
                onClick={handleVerify}
                disabled={!mobile}
              >
                Verify Mobile
              </Button>
            </>
          ) : (
            <>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <LockResetIcon sx={{ mr: 1, color: "gray" }} />
                  ),
                }}
                sx={{ mb: 3 }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  py: 1.2,
                  borderRadius: 3,
                  "&:hover": { backgroundColor: "#388e3c" },
                }}
                onClick={handleReset}
                disabled={!newPassword}
              >
                Reset Password
              </Button>
            </>
          )}

          <Typography variant="body2" sx={{ mt: 3 }}>
            Remembered your password?{" "}
            <Typography
              component="span"
              color="error"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => navigate("/login")}
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
