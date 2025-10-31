import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
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
  useMediaQuery,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import BusinessIcon from "@mui/icons-material/Business";
import NumbersIcon from "@mui/icons-material/Numbers";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LockIcon from "@mui/icons-material/Lock";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import img1 from "../../assets/website-registration-concept-create-account-login-illustration-vector.jpg";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: { main: "#f6ae22" },
    background: { default: "#f6f6f6", paper: "#ffffff" },
    text: { primary: "#333" },
  },
  typography: { fontFamily: "Poppins, sans-serif" },
});

export default function StudentRegistrationForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    pincode: "",
    city: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const isSmall = useMediaQuery("(max-width:900px)");

  const handleChange = (key) => (e) => {
    let value = e.target.value;
    if (["mobile", "pincode"].includes(key)) value = value.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" })); // clear error
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
    setErrors((prev) => ({ ...prev, pincode: "" }));
    if (pincode.length === 6) {
      const city = await fetchCityFromPin(pincode);
      setForm((prev) => ({ ...prev, city }));
    }
  };

  const completedYears = ["2018", "2019", "2020", "2021", "2022", "2023", "2024"];
  const pursuingYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const validateForm = () => {
    let newErrors = {};
    const requiredFields = [
      "fullName",
      "email",
      "mobile",
      "gender",
      "dob",
      "college",
      "department",
      "pursuingYear",
      "whichYear",
      "pincode",
      "city",
      "password",
      "confirmPassword",
    ];

    requiredFields.forEach((field) => {
      if (!form[field]) newErrors[field] = "This field is required";
    });

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (form.mobile && form.mobile.length !== 10)
      newErrors.mobile = "Mobile number must be 10 digits";
    if (form.password && form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch("https://project2-f2lk.onrender.com/api/students/register", {
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
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#808080" },
      "&:hover fieldset": { borderColor: "#808080" },
      "&.Mui-focused fieldset": { borderColor: "#808080" },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 1, sm: 2 },
        }}
      >
        <Paper
          elevation={4}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            maxWidth: 1300,
            borderRadius: 3,
            overflow: "hidden",
            height: { xs: "auto", md: "100vh" },
          }}
        >
          {/* LEFT IMAGE */}
          <Box
            sx={{
              display: { xs: "none", sm: "none", md: "flex" },
              flex: "0 0 42%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff7e6",
            }}
          >
            <Box
              component="img"
              src={img1}
              alt="Registration"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          {/* RIGHT FORM */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 2, sm: 3, md: 4 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflowY: "auto",
            }}
          >
            <Box>
              <Typography
                variant="h4"
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
                    required
                    label="Full Name"
                    value={form.fullName}
                    onChange={handleChange("fullName")}
                    fullWidth
                    error={!!errors.fullName}
                    helperText={errors.fullName}
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
                    required
                    label="Email"
                    value={form.email}
                    onChange={handleChange("email")}
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email}
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
                    required
                    label="Mobile"
                    value={form.mobile}
                    onChange={handleChange("mobile")}
                    fullWidth
                    error={!!errors.mobile}
                    helperText={errors.mobile}
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
                    required
                    label="Date of Birth"
                    type="date"
                    value={form.dob}
                    onChange={handleChange("dob")}
                    fullWidth
                    error={!!errors.dob}
                    helperText={errors.dob}
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

                <Grid item xs={12}>
                  <FormControl component="fieldset" error={!!errors.gender}>
                    <RadioGroup row value={form.gender} onChange={handleChange("gender")}>
                      <FormControlLabel value="Male" control={<Radio color="primary" />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio color="primary" />} label="Female" />
                      <FormControlLabel value="Other" control={<Radio color="primary" />} label="Other" />
                    </RadioGroup>
                    <Typography variant="caption" color="error">
                      {errors.gender}
                    </Typography>
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
                    required
                    label="College"
                    value={form.college}
                    onChange={handleChange("college")}
                    fullWidth
                    error={!!errors.college}
                    helperText={errors.college}
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
                    required
                    label="Department"
                    value={form.department}
                    onChange={handleChange("department")}
                    fullWidth
                    error={!!errors.department}
                    helperText={errors.department}
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
                    required
                    select
                    label="Status"
                    value={form.pursuingYear}
                    onChange={handleChange("pursuingYear")}
                    SelectProps={{ native: true }}
                    fullWidth
                    error={!!errors.pursuingYear}
                    helperText={errors.pursuingYear}
                    variant="outlined"
                    sx={textFieldStyle}
                  >
                    <option value=""></option>
                    <option value="Completed">Completed</option>
                    <option value="Pursuing">Pursuing</option>
                  </TextField>
                </Grid>

                {form.pursuingYear && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      select
                      label={form.pursuingYear === "Completed" ? "Completion Year" : "Current Year"}
                      value={form.whichYear}
                      onChange={handleChange("whichYear")}
                      SelectProps={{ native: true }}
                      fullWidth
                      error={!!errors.whichYear}
                      helperText={errors.whichYear}
                      variant="outlined"
                      sx={textFieldStyle}
                    >
                      <option value=""></option>
                      {(form.pursuingYear === "Completed" ? completedYears : pursuingYears).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
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
                    required
                    label="PIN Code"
                    value={form.pincode}
                    onChange={handlePinChange}
                    fullWidth
                    error={!!errors.pincode}
                    helperText={errors.pincode}
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
                    required
                    label="City"
                    value={form.city}
                    fullWidth
                    error={!!errors.city}
                    helperText={errors.city}
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
                    required
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={handleChange("password")}
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password}
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
                    required
                    label="Confirm Password"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    fullWidth
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
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
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <LoadingButton
                loading={loading}
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleSubmit}
                sx={{
                  px: { xs: 4, sm: 6 },
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                {loading ? "Registering..." : "Register"}
              </LoadingButton>

              <Typography variant="body2" sx={{ mt: 2 }}>
                Have an Admin account?{" "}
                <Typography
                  component="span"
                  color="error"
                  sx={{ cursor: "pointer", fontWeight: "bold" }}
                  onClick={() => navigate("/login")}
                >
                  Login here
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
          <Alert severity={snack.severity}>{snack.message}</Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
