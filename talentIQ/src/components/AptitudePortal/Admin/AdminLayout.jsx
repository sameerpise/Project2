import React, { useState } from "react";
import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: "margin-left 0.35s ease, width 0.35s ease",
          ml: isMobile ? 0 : collapsed ? "80px" : "250px",
          
          width: isMobile
            ? "100%"
            : collapsed
            ? "calc(100% - 80px)"
            : "calc(100% - 250px)",
          boxSizing: "border-box",
          backgroundColor: "#f7f9fc",
          minHeight: "100vh",
        }}
      >
        {/* Top Bar (for mobile menu toggle) */}
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              bgcolor: "#fff",
              p: 1.5,
              borderRadius: 2,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <IconButton onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1 }}>
              Admin Dashboard
            </Typography>
          </Box>
        )}

        {/* --- Page Content --- */}
        <Outlet />
      </Box>
    </Box>
  );
}
