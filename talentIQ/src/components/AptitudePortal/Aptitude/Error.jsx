import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to top, #ffe0e0, #ffffff)",
      }}
    >
      <Typography variant="h4" sx={{ color: "red", fontWeight: "bold", mb: 2 }}>
        You are not eligible for the GD round ❌
      </Typography>
      <Typography sx={{ mb: 3, color: "#555" }}>
        Please contact your coordinator or try again in the next test.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/dashboard")}>
        Go Back
      </Button>
    </Box>
  );
}
