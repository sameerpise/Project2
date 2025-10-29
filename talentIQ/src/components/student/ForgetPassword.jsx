import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });

  const handleVerify = async () => {
    try {
      const res = await fetch("https://project2-f2lk.onrender.com/api/students/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUserId(data.id);
      setStep(2);
      setSnack({ open: true, message: "User verified! Set new password.", severity: "success" });
    } catch (err) {
      setSnack({ open: true, message: err.message, severity: "error" });
    }
  };

  const handleReset = async () => {
    try {
      const res = await fetch(`https://project2-f2lk.onrender.com/api/students/reset-password/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSnack({ open: true, message: "Password updated successfully!", severity: "success" });
     setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setSnack({ open: true, message: err.message, severity: "error" });
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", bgcolor: "#fafafa" }}>
      <Paper elevation={3} sx={{ p: 4, width: 400, borderRadius: 3 }}>
        <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 600 }}>
          🔐 Forget Password
        </Typography>

        {step === 1 && (
          <>
            <TextField
              fullWidth
              label="Enter Registered Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleVerify}
              disabled={!mobile}
            >
              Verify
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <TextField
              fullWidth
              label="Enter New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={handleReset}
              disabled={!newPassword}
            >
              Reset Password
            </Button>
          </>
        )}

        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack({ ...snack, open: false })}
        >
          <Alert severity={snack.severity}>{snack.message}</Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
