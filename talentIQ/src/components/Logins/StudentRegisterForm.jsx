

import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
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
// Helper function to check form validity
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
  return requiredFields.every((field) => form[field].trim() !== "") && form.password === form.confirmPassword;
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
    pt: { xs: `calc(env(safe-area-inset-top, 20px) + 10px)`, md: 3 }, // <-- added top safe area
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
    height: { xs: "auto", md: "100vh" }, // ✅ auto height on small screens
  }}
>
          {/* LEFT IMAGE */}
{/* LEFT IMAGE */}
<Box
  sx={{
    display: { xs: "none", sm: "none", md: "flex" }, // ✅ hide on mobile & tablet
    flex: "0 0 42%", // fixed width on large screens
    height: "auto", // auto height to fit parent Paper
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
    overflowY: "auto", // <-- allows scrolling
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

                <Grid item xs={12}>
                  <FormControl component="fieldset">
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
                    <option value=""></option>
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
                      <option value=""></option>
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
