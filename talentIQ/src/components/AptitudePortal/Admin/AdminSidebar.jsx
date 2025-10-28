import React from "react";
import {
  Box,
  Stack,
  Avatar,
  Typography,
  Button,
  Tooltip,
  Divider,
  Paper,
  useMediaQuery,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminSidebar({ collapsed = false, onClose }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const admin = useSelector((state) => state.student?.student || {});
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    if (onClose) onClose();
  };

  const menuItems = [
    { label: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
    { label: "Student List", path: "/admin/studentlist", icon: <SchoolIcon /> },
    { label: "Tests", path: "/admin/test", icon: <AssignmentIcon /> },
  ];

  return (
    <Paper
      elevation={4}
      sx={{
        height: "100vh",
        width: collapsed ? 80 : 270,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #1976d2, #1565c0)",
        color: "#fff",
        borderRadius: 0,
        transition: "width 0.3s ease",
        overflow: "hidden",
      }}
    >
      <Stack spacing={2} sx={{ p: 2, flexGrow: 1 }}>
        {!collapsed && (
          <Typography variant="h6" fontWeight="bold" textAlign="center">
            Admin Panel
          </Typography>
        )}

        {!collapsed && (
          <Box textAlign="center" sx={{ mt: 2 }}>
            <Avatar
              src={admin?.avatar || "/admin.png"}
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                border: "2px solid rgba(255,255,255,0.5)",
              }}
            />
            <Typography variant="h6" mt={1}>
              {admin?.fullName || "Admin User"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {admin?.email || "admin@example.com"}
            </Typography>
          </Box>
        )}

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", my: 2 }} />

        <Stack spacing={1.2}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip
                key={item.path}
                title={collapsed ? item.label : ""}
                placement="right"
              >
                <Button
                  fullWidth
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile && onClose) onClose();
                  }}
                  startIcon={!collapsed ? item.icon : null}
                  sx={{
                    justifyContent: collapsed ? "center" : "flex-start",
                    color: "#fff",
                    fontWeight: isActive ? 600 : 400,
                    borderRadius: 2,
                    py: 1.2,
                    background: isActive
                      ? "rgba(255,255,255,0.25)"
                      : "transparent",
                    "&:hover": {
                      background: "rgba(255,255,255,0.35)",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {collapsed ? item.icon : item.label}
                </Button>
              </Tooltip>
            );
          })}
        </Stack>
      </Stack>

      <Box sx={{ p: 2 }}>
        <Tooltip title={collapsed ? "Logout" : ""} placement="right">
          <Button
            fullWidth
            startIcon={!collapsed ? <LogoutIcon /> : null}
            onClick={handleLogout}
            sx={{
              py: 1.2,
              borderRadius: 2,
              background: "rgba(255,255,255,0.25)",
              color: "#fff",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                background: "rgba(255,255,255,0.4)",
              },
            }}
          >
            {!collapsed ? "Logout" : <LogoutIcon />}
          </Button>
        </Tooltip>
      </Box>
    </Paper>
  );
}
