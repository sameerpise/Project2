import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
  Slide,
  Avatar,
  Tooltip,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useSelector } from "react-redux";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");
  const admin = useSelector((state) => state.student?.student || {});

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const sidebarWidth = collapsed ? 80 : 270;

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* 🟪 Sidebar */}
      <Slide direction="right" in={!isMobile || mobileOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "fixed",
            zIndex: isMobile ? 1300 : 1100,
            height: "100vh",
            width: sidebarWidth,
            flexShrink: 0,
            transition: "width 0.3s ease",
            overflow: "hidden",
          }}
        >
          <AdminSidebar
            onCollapseChange={setCollapsed}
          />
        </Box>
      </Slide>

      {/* 🟦 Top AppBar */}
      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          width: { md: `calc(100% - ${sidebarWidth}px)` },
          ml: { md: `${sidebarWidth}px` },
          background: "linear-gradient(90deg, #2196f3, #1976d2)",
          color: "#fff",
          transition: "all 0.3s ease",
          borderBottomLeftRadius: { md: 24 },
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" fontWeight={600}>
              Admin Dashboard
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <NotificationsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={admin?.fullName || "Admin"}>
              <Avatar
                src={admin?.avatar || "/admin.png"}
                alt="Admin"
                sx={{ width: 40, height: 40, border: "2px solid #fff" }}
              />
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* 🟨 Main Content */}
      <Box
        component={motion.main}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        sx={{
          flexGrow: 1,
          mt: "64px", // space for AppBar
          ml: { xs: 0, md: `${sidebarWidth}px` },
          background: "linear-gradient(to bottom right, #f8fafc, #ffffff)",
          borderTopLeftRadius: { md: 24 },
          borderBottomLeftRadius: { md: 24 },
          boxShadow: { md: "inset 4px 0px 20px rgba(0,0,0,0.05)" },
          transition: "margin 0.3s ease",
          overflow: "hidden",
          height: "calc(100vh - 64px)",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
            px: { xs: 1, sm: 2, md: 3 },
            pb: 2,
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#bdbdbd",
              borderRadius: "4px",
            },
          }}
        >
          <Box sx={{ maxWidth: "1400px", mx: "auto", p: { xs: 1, sm: 2 } }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
