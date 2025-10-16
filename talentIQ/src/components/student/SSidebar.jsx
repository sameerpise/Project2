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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/studentSlice";

export default function SSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const student = useSelector((state) => state.student.student);

  const [collapsed, setCollapsed] = useState(false);

 const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const menuItems = [
    { label: "Dashboard", path: "/student", icon: <DashboardIcon /> },
    { label: "Aptitude", path: "/student/AptitudePortal", icon: <SchoolIcon /> },
  ];

  return (
    <Box
      sx={{
        width: collapsed ? 80 : 250,
        bgcolor: "linear-gradient(180deg, #1565c0 0%, #1976d2 100%)",
        background: "linear-gradient(180deg, #1565c0 0%, #1976d2 100%)",
        color: "#fff",
        minHeight: "100vh",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "4px 0 15px rgba(0,0,0,0.2)",
        transition: "width 0.3s ease",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 100,
      }}
    >
      <Stack spacing={2} alignItems={collapsed ? "center" : "flex-start"}>
        {/* Toggle Menu */}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
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
                  onClick={() => navigate(item.path)}
                  startIcon={!collapsed ? item.icon : null}
                  sx={{
                    color: "#fff",
                    justifyContent: collapsed ? "center" : "flex-start",
                    py: 1.2,
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
          startIcon={!collapsed ? <LogoutIcon /> : null}
          onClick={handleLogout}
          sx={{
            mt: 2,
            py: 1.2,
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
          {!collapsed ? "Logout" : <LogoutIcon />}
        </Button>
      </Tooltip>
    </Box>
  );
}
