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
  Slide,
} from "@mui/material";
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SSidebar({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const student = useSelector((state) => state.student.student);
  const isMobile = useMediaQuery("(max-width:900px)");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { label: "Aptitude", path: "/student/AptitudePortal", icon: <SchoolIcon /> },
    { label: "Results", path: "/student/Results", icon: <BarChartIcon /> },
    { label: "Assignments", path: "/student/Assignments", icon: <AssignmentIcon /> },
  ];

  const sidebarContent = (
    <Slide direction="right" in={true} mountOnEnter unmountOnExit>
      <Stack
        spacing={2}
        sx={{
          height: "100%",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, rgba(255,184,76,0.95), rgba(246,174,34,0.9))",
          backdropFilter: "blur(15px)",
          color: "#fff",
          width: collapsed ? 80 : 250,
          transition: "all 0.3s ease",
          p: 2,
          boxShadow: "4px 0 15px rgba(0,0,0,0.25)",
        }}
      >
        {/* --- TOP SECTION --- */}
        <Stack spacing={2} alignItems={collapsed ? "center" : "flex-start"}>
          {/* Collapse / Close Button */}
          <IconButton
            onClick={() => (isMobile ? setMobileOpen(false) : setCollapsed(!collapsed))}
            sx={{
              color: "#fff",
              alignSelf: collapsed ? "center" : "flex-end",
              "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
            }}
          >
            {isMobile ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          {/* Profile Info */}
          {!collapsed && (
            <Box textAlign="center">
              <Avatar
                src={student?.avatar || "/profile.png"}
                sx={{
                  width: 70,
                  height: 70,
                  mx: "auto",
                  border: "2px solid rgba(255,255,255,0.4)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              />
              <Typography variant="h6" mt={1} fontWeight="600">
                {student?.fullName || "Student Name"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {student?.email || "student@email.com"}
              </Typography>
            </Box>
          )}

          <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", width: "100%", my: 1 }} />

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
                    startIcon={!collapsed ? item.icon : null}
                    sx={{
                      color: "#fff",
                      justifyContent: collapsed ? "center" : "flex-start",
                      py: 1.2,
                      borderRadius: 2,
                      fontWeight: isActive ? 600 : 400,
                      fontSize: "0.95rem",
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.25)"
                        : "transparent",
                      boxShadow: isActive ? "0 0 10px rgba(255,255,255,0.3)" : "none",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.35)",
                        transform: "scale(1.05)",
                      },
                      textTransform: "none",
                      transition: "all 0.25s ease",
                    }}
                  >
                    {collapsed ? item.icon : item.label}
                  </Button>
                </Tooltip>
              );
            })}
          </Stack>
        </Stack>

        {/* --- LOGOUT SECTION --- */}
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
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                background: "rgba(255,255,255,0.4)",
                transform: "scale(1.05)",
                boxShadow: "0 0 12px rgba(255,255,255,0.4)",
              },
            }}
          >
            {!collapsed ? "Logout" : <LogoutIcon />}
          </Button>
        </Tooltip>
      </Stack>
    </Slide>
  );

  return (
    <>
      {/* --- Mobile Floating Button with Animation --- */}
      {isMobile && (
        <motion.div
          animate={{ rotate: mobileOpen ? 180 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{
            position: "fixed",
            top: 15,
            left: 15,
            zIndex: 2000,
          }}
        >
          <IconButton
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{
              background: "#ffb84c",
              "&:hover": { background: "#f6ae22" },
              color: "#fff",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
            }}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </motion.div>
      )}

      {/* --- Drawer with Slide Animation --- */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true,
            onBackdropClick: () => setMobileOpen(false),
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: 250,
              boxShadow: "4px 0 15px rgba(0,0,0,0.25)",
              background:
                "linear-gradient(135deg, rgba(255,184,76,0.95), rgba(246,174,34,0.9))",
              color: "#fff",
              backdropFilter: "blur(12px)",
              transition: "transform 0.4s ease-in-out",
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
            zIndex: 100,
          }}
        >
          {sidebarContent}
        </Box>
      )}
    </>
  );
}
