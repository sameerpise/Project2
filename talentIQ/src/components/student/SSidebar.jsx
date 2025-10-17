import React, { useState } from "react";
import {
  Box,
  Stack,
  Avatar,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Divider,
  useMediaQuery,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/studentslice";

export default function SSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const student = useSelector((state) => state.student.student);

  const isMobile = useMediaQuery("(max-width:900px)");
  const [collapsed, setCollapsed] = useState(isMobile); // collapsed on mobile by default
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const menuItems = [

    { label: "Aptitude", path: "/student/AptitudePortal", icon: <SchoolIcon /> },
    { label: "Results", path: "/student/AptitudePortal", icon: <BarChartIcon /> },
    { label: "Assignments", path: "/student/AptitudePortal", icon: <AssignmentIcon /> },
  ];

  const sidebarContent = (
    <Box
      sx={{
        width: collapsed ? 80 : 173,
        background: "linear-gradient(180deg, #1565c0 0%, #1976d2 100%)",
        color: "#fff",
        minHeight: "100vh",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "width 0.3s ease",
      }}
    >
      <Stack spacing={2} alignItems={collapsed ? "center" : "flex-start"}>
        {/* Toggle Menu */}
        <IconButton
          onClick={toggleSidebar}
          sx={{
            color: "#fff",
            mb: 1,
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Student Info */}
        {!collapsed && (
          <Box textAlign="center">
            <Avatar
              src={student?.avatar || "/profile.png"}
              sx={{
                width: 70,
                height: 70,
                mx: "auto",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            />
            <Typography variant="h6" mt={1} fontWeight="600">
              {student?.fullName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {student?.email}
            </Typography>
          </Box>
        )}

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", width: "100%", my: 2 }} />

        {/* Menu Buttons */}
        <Stack spacing={1} width="100%">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip key={idx} title={collapsed ? item.label : ""} placement="right">
                <Button
                  fullWidth
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setMobileOpen(false);
                  }}
                  startIcon={item.icon}
                  sx={{
                    color: "#fff",
                    justifyContent: collapsed ? "center" : "flex-start",
                    py: 1.3,
                    borderRadius: 2,
                    fontWeight: isActive ? 600 : 400,
                    fontSize: "0.95rem",
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.3)",
                      transform: "scale(1.03)",
                    },
                    textTransform: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {!collapsed && item.label}
                </Button>
              </Tooltip>
            );
          })}
        </Stack>
      </Stack>

      {/* Logout Button */}
      <Tooltip title={collapsed ? "Logout" : ""} placement="right">
        <Button
          fullWidth
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            mt: 2,
            py: 1.3,
            borderRadius: 2,
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(8px)",
            color: "#fff",
            fontWeight: 500,
            textTransform: "none",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.35)",
              transform: "scale(1.05)",
            },
          }}
        >
          {!collapsed && "Logout"}
        </Button>
      </Tooltip>
    </Box>
  );

  return isMobile ? (
    <>
      <IconButton
        onClick={toggleSidebar}
        sx={{ position: "fixed", top: 16, left: 16, zIndex: 200, color: "#1565c0" }}
      >
        <MenuIcon fontSize="large" />
      </IconButton>
      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        {sidebarContent}
      </Drawer>
    </>
  ) : (
    sidebarContent
  );
}
