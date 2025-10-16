import React from "react";
import { Box, Button, Container, Grid, Typography, Paper } from "@mui/material";

export default function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 8,
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box textAlign="center" sx={{ mb: 10 }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}
          >
            Online Aptitude Test Software
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, opacity: 0.9, maxWidth: "700px", mx: "auto" }}
          >
            A next-gen MERN-based exam portal for institutes, companies, and
            training centers.  
            ⚡ Handle 500+ concurrent users with ease 🚀
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              mr: 2,
              borderRadius: 50,
              px: 4,
              py: 1.5,
              background: "#ff4b2b",
              "&:hover": { background: "#ff6a3d" },
              fontWeight: "bold",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
            }}
            onClick={() => window.open("http://your-demo-link.com", "_blank")}
          >
            🚀 Live Demo
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 50,
              px: 4,
              py: 1.5,
              borderColor: "white",
              color: "white",
              "&:hover": { background: "rgba(255,255,255,0.2)" },
              fontWeight: "bold",
            }}
            onClick={() => window.open("mailto:yourmail@gmail.com")}
          >
            📩 Contact Us
          </Button>
        </Box>

        {/* Features */}
        <Grid container spacing={4} sx={{ mb: 12 }}>
          {[
            "🎯 Random 50 Questions from 100+ Pool",
            "🔐 Student Registration + Secure Login",
            "📊 Admin Dashboard & Reports",
            "⚡ Handles 500+ Concurrent Users",
            "♻️ Retest Functionality",
            "📈 Detailed Score & Analytics",
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    background: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {feature}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Pricing */}
        <Box textAlign="center" sx={{ mb: 12 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            💰 Pricing
          </Typography>
          <Grid container spacing={5} justifyContent="center">
            {[
              { title: "Single License", price: "₹25,000", desc: "For individual institutes" },
              { title: "Institute License", price: "₹40,000", desc: "Unlimited students & usage" },
            ].map((plan, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Paper
                  elevation={8}
                  sx={{
                    p: 5,
                    borderRadius: 4,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(15px)",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      background: "rgba(255,255,255,0.25)",
                    },
                  }}
                >
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      {plan.title}
                    </Typography>
                    <Typography variant="h3" color="yellow" gutterBottom>
                      {plan.price}
                    </Typography>
                    <Typography sx={{ mb: 3 }}>{plan.desc}</Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      borderRadius: 50,
                      py: 1.5,
                      mt: 2,
                      background: "linear-gradient(45deg,#ff4b2b,#ff416c)",
                      "&:hover": { opacity: 0.9 },
                      fontWeight: "bold",
                    }}
                  >
                    Buy Now
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact */}
        <Box textAlign="center" sx={{ py: 6 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            📞 Get in Touch
          </Typography>
          <Typography sx={{ opacity: 0.9 }}>
            📧 Email: <b>yourmail@gmail.com</b> | 📱 WhatsApp: <b>+91-9876543210</b>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
