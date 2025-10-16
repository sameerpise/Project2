import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import RegisterImage from "../../assets/LoginPage.png";
import NumbersIcon from "@mui/icons-material/Numbers";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function StudentRegistrationForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    college: "",
    department: "",
    year: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (key) => (e) => {
    let value = e.target.value;

    // Only allow numbers for mobile and pincode
    if (["mobile", "pincode"].includes(key)) value = value.replace(/\D/g, "");

    setForm((prev) => ({ ...prev, [key]: value }));

    // Validation
    setErrors((prev) => {
      const newErrors = { ...prev };
      switch (key) {
        case "fullName":
          newErrors.fullName = value.trim() ? "" : "Full name is required";
          break;
        case "email":
          if (!value) newErrors.email = "Email required";
          else if (!/^\S+@\S+\.\S+$/.test(value)) newErrors.email = "Invalid email";
          else newErrors.email = "";
          break;
        case "mobile":
          if (!value) newErrors.mobile = "Mobile number required";
          else if (value.length !== 10) newErrors.mobile = "Mobile number must be 10 digits";
          else newErrors.mobile = "";
          break;
        case "pincode":
          if (!value) newErrors.pincode = "PIN Code required";
          else if (value.length !== 6) newErrors.pincode = "PIN Code must be 6 digits";
          else newErrors.pincode = "";
          break;
        case "password":
          newErrors.password = value ? "" : "Password required";
          if (form.confirmPassword && value !== form.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";
          else newErrors.confirmPassword = "";
          break;
        case "confirmPassword":
          newErrors.confirmPassword = value === form.password ? "" : "Passwords do not match";
          break;
        default:
          break;
      }
      return newErrors;
    });
  };

  const fetchCityFromPin = async (pin) => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await response.json();
      if (data[0].Status === "Success") return data[0].PostOffice[0].District;
      return "";
    } catch (error) {
      console.error("Error fetching city:", error);
      return "";
    }
  };

  const handlePinChange = async (e) => {
    let pincode = e.target.value.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, pincode }));
    if (pincode.length === 6) {
      const city = await fetchCityFromPin(pincode);
      setForm((prev) => ({ ...prev, city }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if any errors exist
    for (let key in errors) if (errors[key]) return;

    try {
      const res = await fetch("http://localhost:5000/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSnack({ open: true, message: "Registered Successfully!", severity: "success" });
      setTimeout(() => {
        navigate("/login", { state: { email: form.email, password: form.password } });
      }, 1500);
    } catch (err) {
      setSnack({ open: true, message: err.message, severity: "error" });
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
          maxWidth: 1200,
          width: "100%",
        }}
      >
        {/* Left Image */}
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
            src={RegisterImage}
            alt="Register Illustration"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>

        {/* Right Form */}
        <Box sx={{ flex: 1.2, p: { xs: 2, md: 5 }, overflowY: "auto" }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            STUDENT REGISTRATION
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Fill in the details to register.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
              Personal Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Full Name"
                  name="fullName"
                  fullWidth
                  size="small"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  helperText={errors.fullName}
                  error={!!errors.fullName}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  size="small"
                  value={form.email}
                  onChange={handleChange("email")}
                  helperText={errors.email}
                  error={!!errors.email}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Mobile"
                  name="mobile"
                  fullWidth
                  size="small"
                  value={form.mobile}
                  onChange={handleChange("mobile")}
                  helperText={errors.mobile}
                  error={!!errors.mobile}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  name="dob"
                  fullWidth
                  size="small"
                  value={form.dob}
                  onChange={handleChange("dob")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Gender</InputLabel>
                  <Select name="gender" value={form.gender} onChange={handleChange("gender")}>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Education */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: "bold" }}>
              Education
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="College"
                  name="college"
                  fullWidth
                  size="small"
                  value={form.college}
                  onChange={handleChange("college")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Department"
                  name="department"
                  fullWidth
                  size="small"
                  value={form.department}
                  onChange={handleChange("department")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Year"
                  name="year"
                  fullWidth
                  size="small"
                  value={form.year}
                  onChange={handleChange("year")}
                />
              </Grid>
            </Grid>

            {/* Address */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: "bold" }}>
              Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  fullWidth
                  size="small"
                  value={form.address}
                  onChange={handleChange("address")}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="City"
                  name="city"
                  fullWidth
                  size="small"
                  value={form.city}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationCityIcon />
                      </InputAdornment>
                    ),
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="State"
                  name="state"
                  fullWidth
                  size="small"
                  value={form.state}
                  onChange={handleChange("state")}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Pincode"
                  name="pincode"
                  fullWidth
                  size="small"
                  value={form.pincode}
                  onChange={handlePinChange}
                  helperText={errors.pincode}
                  error={!!errors.pincode}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NumbersIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Password */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: "bold" }}>
              Set Password
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  fullWidth
                  size="small"
                  value={form.password}
                  onChange={handleChange("password")}
                  helperText={errors.password}
                  error={!!errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  fullWidth
                  size="small"
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  helperText={errors.confirmPassword}
                  error={!!errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Register Button */}
            <Button
              variant="contained"
              fullWidth
              type="submit"
              sx={{
                mt: 3,
                py: 1.2,
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: 3,
                backgroundColor: "#f44336",
                "&:hover": { backgroundColor: "#d32f2f" },
              }}
            >
              Register
            </Button>
          </form>
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
