import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  CircularProgress,
  Divider,
  Button,
  Stack,
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  School,
  CalendarMonth,
  Wc,
  AccountBalance,
  Apartment,
  Tag,
  ArrowBack,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";

export default function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`https://project2-f2lk.onrender.com/api/students/${id}`);
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error("Failed to fetch student:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );

  if (!student)
    return (
      <Typography align="center" color="error" sx={{ mt: 10 }}>
        Student not found!
      </Typography>
    );

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        background: "linear-gradient(135deg, #1e3c72, #2a5298, #6f86d6)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          color: "#fff",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, #7f00ff, #e100ff, #ff7f50)",
            textAlign: "center",
            py: 5,
            px: 2,
          }}
        >
          <Avatar
            sx={{
              width: 110,
              height: 110,
              mx: "auto",
              mb: 2,
              bgcolor: "rgba(255,255,255,0.9)",
              color: "#7f00ff",
              fontSize: 40,
              fontWeight: 700,
              border: "3px solid rgba(255,255,255,0.3)",
              boxShadow: "0 0 15px rgba(255,255,255,0.4)",
            }}
          >
            {student.fullName?.[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {student.fullName}
          </Typography>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{ mt: 1, opacity: 0.9 }}
          >
            <Email fontSize="small" />
            <Typography variant="body1">{student.email}</Typography>
          </Stack>
        </Box>

        {/* Details Section */}
        <CardContent sx={{ p: { xs: 3, md: 5 }, color: "#fff" }}>
          <Grid container spacing={3}>
            {[
              { label: "Mobile", value: student.mobile, icon: <Phone /> },
              { label: "Gender", value: student.gender, icon: <Wc /> },
              { label: "Date of Birth", value: student.dob, icon: <CalendarMonth /> },
              { label: "College", value: student.college, icon: <AccountBalance /> },
              { label: "Department", value: student.department, icon: <Apartment /> },
              { label: "Year", value: student.whichYear, icon: <School /> },
              { label: "City", value: student.city, icon: <LocationOn /> },
              { label: "Pincode", value: student.pincode, icon: <Tag /> },
            ].map((item) => (
              <Grid item xs={12} sm={6} md={6} key={item.label}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    transition: "0.3s",
                    "&:hover": {
                      background: "rgba(255,255,255,0.15)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  {item.icon}
                  <Box>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      {item.value || "—"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.2)" }} />

          {/* Back Button */}
          <Box sx={{ textAlign: "center" }}>
            <Button
              startIcon={<ArrowBack />}
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                py: 1.2,
                borderRadius: 2,
                background: "linear-gradient(135deg, #7f00ff, #e100ff)",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #e100ff, #7f00ff)",
                },
              }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
