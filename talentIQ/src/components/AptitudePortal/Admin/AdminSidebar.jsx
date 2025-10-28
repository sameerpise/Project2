import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Avatar,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Drawer,
  useMediaQuery,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Redux/studentslice";

export default function AdminSidebar({ onClose, onCollapseChange }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const admin = useSelector((state) => state.student?.student || {});
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    if (typeof onCollapseChange === "function") {
      onCollapseChange(collapsed);
    }
  }, [collapsed, onCollapseChange]);

  const menuItems = [
    { label: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
    { label: "Student List", path: "/admin/studentlist", icon: <SchoolIcon /> },
    { label: "Tests", path: "/admin/test", icon: <AssignmentIcon /> },
  ];

  // --- SIDEBAR CONTENT ---
  const sidebarContent = (
    <Paper
      elevation={4}
      sx={{
        height: "100%",
        width: collapsed ? 80 : 260,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backdropFilter: "blur(20px)",
        background:
          "linear-gradient(135deg, rgba(33,150,243,0.95), rgba(30,136,229,0.9))",
        color: "#fff",
        borderRadius: 0,
        transition: "width 0.3s ease",
        overflow: "hidden",
        boxShadow: "4px 0 15px rgba(0,0,0,0.2)",
      }}
    >
      <Stack spacing={2} sx={{ p: collapsed ? 1.5 : 2, alignItems: "center" }}>
        {/* HEADER */}
        {!collapsed && (
          <Typography
            variant="h6"
            fontWeight="bold"
            textAlign="center"
            sx={{ width: "100%" }}
          >
            Admin Panel
          </Typography>
        )}

        {/* ADMIN INFO */}
        {!collapsed && (
          <Box textAlign="center" sx={{ mt: 1 }}>
            <Avatar
              src={admin?.avatar || "/admin.png"}
              sx={{
                width: 70,
                height: 70,
                mx: "auto",
                border: "2px solid rgba(255,255,255,0.5)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              }}
            />
            <Typography variant="subtitle1" mt={1} fontWeight={600}>
              {admin?.fullName || "Admin User"}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {admin?.email || "admin@example.com"}
            </Typography>
          </Box>
        )}

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", my: 2, width: "100%" }} />

        {/* MENU ITEMS */}
        <Stack spacing={1.2} sx={{ width: "100%", alignItems: "center" }}>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip
                key={index}
                title={collapsed ? item.label : ""}
                placement="right"
              >
                <Button
                  fullWidth
                  onClick={() => navigate(item.path)}
                  startIcon={!collapsed && item.icon}
                  sx={{
                    justifyContent: collapsed ? "center" : "flex-start",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: "0.95rem",
                    borderRadius: 2,
                    py: 1.2,
                    background: isActive
                      ? "rgba(255,255,255,0.25)"
                      : "transparent",
                    boxShadow: isActive
                      ? "0 0 12px rgba(255,255,255,0.4)"
                      : "none",
                    "&:hover": {
                      background: "rgba(255,255,255,0.35)",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease",
                    width: collapsed ? "60px" : "90%",
                    display: "flex",
                    alignItems: "center",
                    gap: collapsed ? 0 : 1.5,
                  }}
                >
                  {collapsed ? item.icon : item.label}
                </Button>
              </Tooltip>
            );
          })}
        </Stack>
      </Stack>

      {/* LOGOUT */}
      <Box sx={{ p: collapsed ? 1 : 2, width: "100%" }}>
        <Tooltip title={collapsed ? "Logout" : ""} placement="right">
          <Button
            fullWidth
            variant="contained"
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
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {!collapsed ? "Logout" : <LogoutIcon />}
          </Button>
        </Tooltip>
      </Box>
    </Paper>
  );

  return (
    <>
      {/* SINGLE HAMBURGER ICON */}
      <IconButton
        onClick={() =>
          isMobile ? setMobileOpen(true) : setCollapsed(!collapsed)
        }
        sx={{
          position: "fixed",
          top: 15,
          left: 15,
          zIndex: 2500,
          background: "#2196f3",
          color: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          "&:hover": { background: "#1e88e5" },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* MOBILE DRAWER */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: 260,
              background:
                "linear-gradient(135deg, rgba(33,150,243,0.95), rgba(30,136,229,0.9))",
              color: "#fff",
              backdropFilter: "blur(15px)",
              boxShadow: "4px 0 15px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Box
          sx={{
            position: "sticky",
            top: 0,
            left: 0,
            height: "100vh",
            overflow: "hidden",
            zIndex: 1200,
          }}
        >
          {sidebarContent}
        </Box>
      )}
    </>
  );
}
