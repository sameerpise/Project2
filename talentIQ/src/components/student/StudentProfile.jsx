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
} from "@mui/material";
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
    <Box sx={{ p: { xs: 2, md: 4 }, background: "#f9f9f9", minHeight: "100vh" }}>
      <Card
        sx={{
          maxWidth: 800,
          mx: "auto",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #f6ae22, #ff7f50)",
            py: 3,
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              width: 90,
              height: 90,
              mx: "auto",
              mb: 1,
              bgcolor: "#fff",
              color: "#f6ae22",
              fontSize: 30,
              fontWeight: 600,
            }}
          >
            {student.fullName?.[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#fff" }}>
            {student.fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: "#fff", opacity: 0.8 }}>
            {student.email}
          </Typography>
        </Box>

        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Mobile
              </Typography>
              <Typography>{student.mobile}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Gender
              </Typography>
              <Typography>{student.gender}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                DOB
              </Typography>
              <Typography>{student.dob}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                College
              </Typography>
              <Typography>{student.college}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Department
              </Typography>
              <Typography>{student.department}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Year
              </Typography>
              <Typography>{student.whichYear}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                City
              </Typography>
              <Typography>{student.city}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Pincode
              </Typography>
              <Typography>{student.pincode}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(-1)}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
