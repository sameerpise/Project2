import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  Alert,
  Divider,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import BusinessIcon from "@mui/icons-material/Business";
import NumbersIcon from "@mui/icons-material/Numbers";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LockIcon from "@mui/icons-material/Lock";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import img1 from "../../assets/Lovepik_com-450092311-Creative design online registration flat illustration.png";

import { useNavigate } from "react-router-dom";

// ---------------- THEME ----------------
const theme = createTheme({
  palette: {
    primary: { main: "#f6ae22" },
    secondary: { main: "#857f7fff" },
    background: { default: "#f6f6f6", paper: "#ffffff" },
    text: { primary: "#333" },
  },
  typography: { fontFamily: "Poppins, sans-serif" },
});

export default function StudentRegistrationForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    college: "",
    department: "",
    pursuingYear: "",
    whichYear: "",
    address: "",
    pincode: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (key) => (e) => {
    let value = e.target.value;
    if (["mobile", "pincode"].includes(key)) value = value.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fetchCityFromPin = async (pin) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data[0].Status === "Success") return data[0].PostOffice[0].District;
      return "";
    } catch {
      return "";
    }
  };

  const handlePinChange = async (e) => {
    const pincode = e.target.value.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, pincode }));
    if (pincode.length === 6) {
      const city = await fetchCityFromPin(pincode);
      setForm((prev) => ({ ...prev, city }));
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("https://project2-bkuo.onrender.com/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSnack({ open: true, message: "Registered successfully!", severity: "success" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setSnack({ open: true, message: err.message, severity: "error" });
    }
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#f6ae22" },
      "&:hover fieldset": { borderColor: "#f6ae22" },
      "&.Mui-focused fieldset": { borderColor: "#f6ae22" },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: "100vh",
          backgroundColor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            display: "flex",
            width: "95%",
            height: "90vh",
            maxWidth: 1300,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Left Illustration */}
          <Box
            component="img"
            src={img1}
            alt="Registration"
            sx={{
              width: "42%",
              height: "100%",
              objectFit: "cover",
              backgroundColor: "#fff7e6",
            }}
          />

          {/* Right Form */}
          <Box
            sx={{
              flex: 1,
              p: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ overflowY: "auto", pr: 1 }}>
              <Typography
                variant="h5"
                align="center"
                sx={{ fontWeight: 600, color: "primary.main", mb: 1 }}
              >
                🎓 Student Registration
              </Typography>
              <Divider sx={{ mb: 2, bgcolor: "primary.main" }} />

              {/* PERSONAL INFO */}
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                🧍 Personal Info
              </Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    value={form.fullName}
                    onChange={handleChange("fullName")}
                    fullWidth
                    variant="outlined"
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    value={form.email}
                    onChange={handleChange("email")}
                    fullWidth
                    variant="outlined"
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Mobile"
                    value={form.mobile}
                    onChange={handleChange("mobile")}
                    fullWidth
                    variant="outlined"
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date of Birth"
                    type="date"
                    value={form.dob}
                    onChange={handleChange("dob")}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* -- GENDER (ADDED) -- */}
                <Grid item xs={12}>
                  <FormControl component="fieldset" sx={{ ml: 0 }}>
                    <RadioGroup row value={form.gender} onChange={handleChange("gender")}>
                      <FormControlLabel value="Male" control={<Radio color="primary" />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio color="primary" />} label="Female" />
                      <FormControlLabel value="Other" control={<Radio color="primary" />} label="Other" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              {/* EDUCATION */}
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mt: 2, mb: 1 }}>
                🎓 Education
              </Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="College"
                    value={form.college}
                    onChange={handleChange("college")}
                    fullWidth
                    variant="outlined"
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SchoolIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Department"
                    value={form.department}
                    onChange={handleChange("department")}
                    fullWidth
                    variant="outlined"
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Status"
                    value={form.pursuingYear}
                    onChange={handleChange("pursuingYear")}
                    SelectProps={{ native: true }}
                    fullWidth
                    variant="outlined"
                    sx={textFieldStyle}
                  >
                    <option value="">Select</option>
                    <option value="Completed">Completed</option>
                    <option value="Pursuing">Pursuing</option>
                  </TextField>
                </Grid>
                {(form.pursuingYear === "Completed" || form.pursuingYear === "Pursuing") && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Year"
                      value={form.whichYear}
                      onChange={handleChange("whichYear")}
                      SelectProps={{ native: true }}
                      fullWidth
                      variant="outlined"
                      sx={textFieldStyle}
                    >
                      <option value="">Select Year</option>
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="4th">4th Year</option>
                    </TextField>
                  </Grid>
                )}
              </Grid>

              {/* ADDRESS */}
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mt: 2, mb: 1 }}>
                🏠 Address
              </Typography>
              <Grid container spacing={1.5}>
               
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="PIN Code"
                    value={form.pincode}
                    onChange={handlePinChange}
                    fullWidth
                    variant="outlined"
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NumbersIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    value={form.city}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationCityIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldStyle}
                  />
                </Grid>
              </Grid>

              {/* SECURITY */}
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mt: 2, mb: 1 }}>
                🔐 Security
              </Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={handleChange("password")}
                    fullWidth
                    variant="outlined"
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Confirm Password"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    fullWidth
                    variant="outlined"
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* REGISTER BUTTON */}
            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleSubmit}
                sx={{ px: 5, fontWeight: 600, textTransform: "none" }}
              >
                Register
              </Button>
            </Box>
             <Typography variant="body2">
           have an Admin account?{" "}
            <Typography
              component="span"
              color="error"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => navigate("/login")}
            >
              Register here
            </Typography>
          </Typography>
          </Box>
        </Paper>

        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack({ ...snack, open: false })}
        >
          <Alert severity={snack.severity}>{snack.message}</Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
