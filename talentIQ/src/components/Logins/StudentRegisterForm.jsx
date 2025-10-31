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
    address: "",
    pincode: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const isSmall = useMediaQuery("(max-width:900px)");

  const handleChange = (key) => (e) => {
    let value = e.target.value;
    if (["mobile", "pincode"].includes(key)) value = value.replace(/\D/g, "");
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "pursuingYear" ? { whichYear: "" } : {}), // reset year when status changes
    }));
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

  const isFormValid = () => {
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
    return (
      requiredFields.every((field) => form[field].trim() !== "") &&
      form.password === form.confirmPassword
    );
  };

  // 🧠 Dynamic Year Options Logic
  const currentYear = new Date().getFullYear();
  const completedYears = Array.from({ length: 8 }, (_, i) => currentYear - i).reverse(); // last 8 years
  const pursuingYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const yearOptions =
    form.pursuingYear === "Completed"
      ? completedYears
      : form.pursuingYear === "Pursuing"
      ? pursuingYears
      : [];

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
          {/* LEFT IMAGE */}
          <Box
            sx={{
              display: { xs: "none", sm: "none", md: "flex" },
              flex: "0 0 42%",
              height: "auto",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              backgroundColor: "#fff7e6",
            }}
          >
            <Box
              component="img"
              src={img1}
              alt="Registration"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
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
              {/* (Your existing personal info fields remain unchanged) */}

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

                {/* 🎯 Dynamic Year Logic */}
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
                    <option value=""></option>
                    <option value="Completed">Completed</option>
                    <option value="Pursuing">Pursuing</option>
                  </TextField>
                </Grid>

                {form.pursuingYear && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label={form.pursuingYear === "Completed" ? "Passing Year" : "Current Year"}
                      value={form.whichYear}
                      onChange={handleChange("whichYear")}
                      SelectProps={{ native: true }}
                      fullWidth
                      variant="outlined"
                      sx={textFieldStyle}
                    >
                      <option value=""></option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                )}
              </Grid>

              {/* (Rest of your Address + Security section remains same) */}
            </Box>

            {/* REGISTER BUTTON */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <LoadingButton
                loading={loading}
                loadingPosition="start"
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
