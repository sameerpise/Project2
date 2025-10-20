import React, { useState, useEffect } from "react";
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
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SSidebar({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const student = useSelector((state) => state.student.student);
  const isMobile = useMediaQuery("(max-width:900px)");
  const [collapsed, setCollapsed] = useState(false);
  // const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Update collapse automatically when screen size changes
  useEffect(() => {
    if (isMobile) setCollapsed(true);
    else setCollapsed(false);
  }, [isMobile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
        width: collapsed ? 80 : 220,
        background: "linear-gradient(180deg, #f6ae22 0%, #0505056c 100%)",
        color: "#fff",
        minHeight: "100vh",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "width 0.3s ease",
      }}
    >
      {/* Top Section */}
      <Stack spacing={2} alignItems={collapsed ? "center" : "flex-start"}>
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

        {/* Menu Items */}
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
                  startIcon={!collapsed ? item.icon : null}
                  sx={{
                    color: "#fff",
                    justifyContent: collapsed ? "center" : "flex-start",
                    py: 1.3,
                    borderRadius: 2,
                    fontWeight: isActive ? 600 : 400,
                    fontSize: "0.95rem",
                    backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "transparent",
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

      {/* Bottom Section */}
      <Tooltip title={collapsed ? "Logout" : ""} placement="right">
        <Button
          fullWidth
          variant="contained"
          startIcon={!collapsed ? <LogoutIcon /> : null}
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
          {!collapsed ? "Logout" : <LogoutIcon />}
        </Button>
      </Tooltip>
    </Box>
  );

  return (
    <>
     {isMobile ? (
  <>
    {/* Mobile Menu Icon */}
    <IconButton
      onClick={() => setMobileOpen(true)}
      sx={{
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: 2000,
        color: "#f6ae22",
      }}
    >
      <MenuIcon fontSize="large" />
    </IconButton>

    {/* Drawer Sidebar for Mobile */}
    <Drawer
      anchor="left"
      open={mobileOpen}
      onClose={() => setMobileOpen(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: 220,
          background: "linear-gradient(180deg, #f6ae22 0%, #0505056c 100%)",
          color: "#fff",
          boxShadow: "4px 0 15px rgba(0,0,0,0.3)",
        },
      }}
    >
      {/* ✅ Scrollable and properly visible sidebar content */}
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 2,
          overflowY: "auto",
        }}
      >
        {sidebarContent}
      </Box>
    </Drawer>
  </>
) : (
  sidebarContent
)}
    </>
  );
}
