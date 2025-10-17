import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useDispatch } from "react-redux";
import { setStudent } from "../Redux/studentslice";
import { useNavigate } from "react-router-dom";
import LoginpageImage from "../../assets/LoginPage.png";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loginType, setLoginType] = useState("student");
  const [loading, setLoading] = useState(false); // <-- Loading state

  const adminCredentials = {
    email: "admin@example.com",
    password: "admin123",
  };

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    localStorage.clear();

    if (loginType === "admin") {
      setTimeout(() => {
        if (
          form.email === adminCredentials.email &&
          form.password === adminCredentials.password
        ) {
          const admin = { name: "Admin", email: form.email, role: "admin" };
          localStorage.setItem("adminToken", "admin-token");
          localStorage.setItem("adminUser", JSON.stringify(admin));
          navigate("/admin");
        } else {
          alert("Invalid Admin Credentials");
        }
        setLoading(false); // Stop loading
      }, 1000);
    } else {
      try {
        const res = await fetch("https://project2-bkuo.onrender.com/api/students/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        dispatch(setStudent({ ...data.student, role: "student" }));
        localStorage.setItem("studentToken", data.token);
        localStorage.setItem(
          "studentUser",
          JSON.stringify({ ...data.student, role: "student" })
        );

        navigate("/student/AptitudePortal");
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false); // Stop loading in all cases
      }
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
        {/* Left - Form */}
        <Box sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            WELCOME BACK
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Please enter your details to continue.
          </Typography>

          {/* Toggle */}
          <ToggleButtonGroup
            value={loginType}
            exclusive
            onChange={(e, value) => value && setLoginType(value)}
            sx={{ mb: 3 }}
            fullWidth
          >
            <ToggleButton value="student">Student</ToggleButton>
            <ToggleButton value="admin">Admin</ToggleButton>
          </ToggleButtonGroup>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange("email")}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: "gray" }} />,
              }}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange("password")}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: "gray" }} />,
              }}
              sx={{ mb: 2 }}
              required
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <FormControlLabel control={<Checkbox />} label="Remember me" />
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/forget")}
              >
                Forgot password?
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading} // Disable during loading
              sx={{
                py: 1.2,
                mb: 2,
                borderRadius: 3,
                fontWeight: 600,
                backgroundColor:
                  loginType === "admin" ? "#1976d2" : "#d32f2f",
                "&:hover": {
                  backgroundColor:
                    loginType === "admin" ? "#1565c0" : "#b71c1c",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : loginType === "admin" ? (
                "Login as Admin"
              ) : (
                "Login as Student"
              )}
            </Button>
          </form>

          <Typography variant="body2">
            Don’t have an account?{" "}
            <Typography
              component="span"
              color="error"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => navigate("/")}
            >
              Register here
            </Typography>
          </Typography>
        </Box>

        {/* Right - Image */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#f5f7fa",
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={LoginpageImage}
            alt="Login Illustration"
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
