
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
    secondary: { main: "#857f7fff" },
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

  const completedYears = ["2018", "2019", "2020", "2021", "2022", "2023", "2024"];
  const pursuingYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#808080" },
      "&:hover fieldset": { borderColor: "#808080" },
      "&.Mui-focused fieldset": { borderColor: "#808080" },
    },
  };

  // --- Validation Function ---
  const validateField = (key, value) => {
    let error = "";
    switch (key) {
      case "fullName":
        if (!value.trim()) error = "Full name is required";
        else if (value.length < 3) error = "Full name must be at least 3 characters";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Enter a valid email";
        break;
      case "mobile":
        if (!/^\d{10}$/.test(value)) error = "Enter a valid 10-digit mobile number";
        break;
      case "dob":
        if (!value) error = "Date of Birth is required";
        break;
      case "gender":
        if (!value) error = "Please select gender";
        break;
      case "college":
        if (!value.trim()) error = "College name is required";
        break;
      case "department":
        if (!value.trim()) error = "Department is required";
        break;
      case "pursuingYear":
        if (!value) error = "Please select status";
        break;
      case "whichYear":
        if (!value) error = "Please select year";
        break;
      case "pincode":
        if (!/^\d{6}$/.test(value)) error = "Enter a valid 6-digit pincode";
        break;
      case "password":
        if (value.length < 6) error = "Password must be at least 6 characters";
        break;
      case "confirmPassword":
        if (value !== form.password) error = "Passwords do not match";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (key) => async (e) => {
    let value = e.target.value;
    if (["mobile", "pincode"].includes(key)) value = value.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, [key]: value }));

    const error = validateField(key, value);
    setErrors((prev) => ({ ...prev, [key]: error }));

    // Auto fetch city from pin
    if (key === "pincode" && value.length === 6) {
      const city = await fetchCityFromPin(value);
      setForm((prev) => ({ ...prev, city }));
    }
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

  const handleSubmit = async () => {
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

  // --- Form Validity ---
  const isFormValid = () => {
    return (
      Object.values(form).every((v) => v.trim() !== "") &&
      Object.values(errors).every((err) => !err) &&
      form.password === form.confirmPassword
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 1, sm: 2 },
          pt: { xs: `calc(env(safe-area-inset-top, 20px) + 10px)`, md: 3 },
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
{/* LEFT IMAGE (Responsive Fixed Version) */}
<Box
  sx={{
    display: { xs: "none", sm: "none", md: "flex" },
    flex: "0 0 42%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffff",
    overflow: "hidden",
    minHeight: "100%", // ensures full column height
  }}
>
  <Box
    component="img"
    src={img1}
    alt="Registration"
    sx={{
      width: "100%",
      height: "auto",
      maxHeight: "100vh", // keeps it from overflowing on big screens
      objectFit: "contain", // prevents cutting
      display: "block",
      flexShrink: 0,
    }}
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
                variant="h3"
                align="center"
                sx={{ fontWeight: 600, color: "primary.main", mb: 1, fontSize: { xs: 20, md: 29 } }}
              >
                🎓 Student Registration
              </Typography>
              <Divider sx={{ mb: 2, bgcolor: "primary.main" }} />

              {/* PERSONAL INFO */}
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                🧍 Personal Info
              </Typography>
              <Grid container spacing={1.5}>
                {[
                  { key: "fullName", label: "Full Name", icon: <PersonIcon color="primary" /> },
                  { key: "email", label: "Email", icon: <EmailIcon color="primary" /> },
                  { key: "mobile", label: "Mobile", icon: <PhoneIcon color="primary" /> },
                ].map(({ key, label, icon }) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      label={label}
                      value={form[key]}
                      onChange={handleChange(key)}
                      fullWidth
                      variant="outlined"
                      sx={textFieldStyle}
                      error={!!errors[key]}
                      helperText={errors[key]}
                      InputProps={{ startAdornment: <InputAdornment position="start">{icon}</InputAdornment> }}
                    />
                  </Grid>
                ))}

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
                    error={!!errors.dob}
                    style={{width:"255px"}}
                    helperText={errors.dob}
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
                    <Typography variant="caption" color="error">{errors.gender}</Typography>
                  </FormControl>
                </Grid>
              </Grid>

              {/* EDUCATION */}
             <Typography variant="subtitle1" sx={{ fontWeight: 500, mt: 2, mb: 1 }}>
  🎓 Education
</Typography>

<Grid container spacing={2}>
  {/* ROW 1 — College & Department */}
  <Grid container item spacing={2}>
    <Grid item xs={12} sm={6}>
      <TextField
        label="College"
        value={form.college}
        onChange={handleChange("college")}
        fullWidth
        variant="outlined"
        sx={textFieldStyle}
        error={!!errors.college}
        helperText={errors.college}
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
        error={!!errors.department}
        helperText={errors.department}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BusinessIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  </Grid>

  {/* ROW 2 — Status & Completion/Current Year */}
<Grid container item spacing={2}>
  {/* Status */}
  <Grid item xs={12} sm={6}>
    <TextField
      select
      label="Status"
      value={form.pursuingYear}
      onChange={(e) => {
        const value = e.target.value;
        setForm((prev) => ({
          ...prev,
          pursuingYear: value,
          whichYear: "",
        }));
        setErrors((prev) => ({
          ...prev,
          pursuingYear: validateField("pursuingYear", value),
        }));
      }}
      SelectProps={{ native: true }}
      fullWidth
      variant="outlined"
      sx={textFieldStyle}
      error={!!errors.pursuingYear}
      helperText={errors.pursuingYear}
      style={{width:"255px"}}
        InputLabelProps={{ shrink: true }}  
    >
      <option value=""></option>
      <option value="Completed">Completed</option>
      <option value="Pursuing">Pursuing</option>
    </TextField>
  </Grid>

  {/* Completion / Current Year */}
  <Grid item xs={12} sm={6}>
    <TextField
      select
      label={
        form.pursuingYear === "Completed"
          ? "Completion Year *"
          : form.pursuingYear === "Pursuing"
          ? "Current Year *"
          : "Select Year *"
      }
      value={form.whichYear}
      onChange={handleChange("whichYear")}
      SelectProps={{ native: true }}
      fullWidth
      variant="outlined"
      error={!!errors.whichYear}
      helperText={errors.whichYear}
      InputLabelProps={{ shrink: true }}
      sx={textFieldStyle}
      disabled={!form.pursuingYear}
      style={{width:"255px"}}
    >
      <option value=""></option>
      {(form.pursuingYear === "Completed"
        ? completedYears
        : form.pursuingYear === "Pursuing"
        ? pursuingYears
        : []
      ).map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </TextField>
  </Grid>
</Grid>

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
                    onChange={handleChange("pincode")}
                    fullWidth
                    variant="outlined"
                    sx={textFieldStyle}
                    error={!!errors.pincode}
                    helperText={errors.pincode}
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
                    error={!!errors.password}
                    helperText={errors.password}
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
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
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
                disabled={!isFormValid()}
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

              <Typography
                variant="body2"
                sx={{ mt: 2, textAlign: "center", fontSize: { xs: 13, sm: 14 } }}
              >
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
