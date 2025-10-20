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
    if (!isMobile) setCollapsed(false);
  }, [isMobile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { label: "Aptitude", path: "/student/AptitudePortal", icon: <SchoolIcon /> },
    { label: "Results", path: "/student/results", icon: <BarChartIcon /> },
    { label: "Assignments", path: "/student/assignments", icon: <AssignmentIcon /> },
  ];

  const sidebarContent = (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
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
            width: collapsed && !isMobile ? 80 : 260,
            transition: "all 0.35s ease",
            p: 2,
            boxShadow: "4px 0 20px rgba(0,0,0,0.25)",
            borderRight: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {/* --- TOP SECTION --- */}
          <Stack
            spacing={2}
            alignItems={collapsed && !isMobile ? "center" : "flex-start"}
          >
            {/* Collapse / Close Button */}
            <IconButton
              onClick={() =>
                isMobile ? setMobileOpen(false) : setCollapsed(!collapsed)
              }
              sx={{
                color: "#fff",
                alignSelf: collapsed && !isMobile ? "center" : "flex-end",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)", transform: "scale(1.1)" },
                transition: "0.3s",
              }}
            >
              {isMobile ? <CloseIcon /> : <MenuIcon />}
            </IconButton>

            {/* Profile Info */}
            {(!collapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Box textAlign="center">
                  <Avatar
                    src={student?.avatar || "/profile.png"}
                    sx={{
                      width: 80,
                      height: 80,
                      mx: "auto",
                      border: "2px solid rgba(255,255,255,0.5)",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "scale(1.08)",
                        boxShadow: "0 0 12px rgba(255,255,255,0.6)",
                      },
                    }}
                  />
                  <Typography variant="h6" mt={1.5} fontWeight="700">
                    {student?.fullName || "Student Name"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.9, fontSize: "0.85rem" }}
                  >
                    {student?.email || "student@email.com"}
                  </Typography>
                </Box>
              </motion.div>
            )}

            <Divider
              sx={{
                bgcolor: "rgba(255,255,255,0.4)",
                width: "100%",
                my: 1,
                borderBottomWidth: 2,
              }}
            />

            {/* Menu Buttons */}
            <Stack spacing={1.2} width="100%">
              {menuItems.map((item, idx) => {
                const isActive = location.pathname === item.path;
                const showLabel = !collapsed || isMobile;
                return (
                  <Tooltip
                    key={idx}
                    title={!showLabel ? item.label : ""}
                    placement="right"
                  >
                    <Button
                      fullWidth
                      onClick={() => {
                        navigate(item.path);
                        if (isMobile) setMobileOpen(false);
                      }}
                      startIcon={showLabel ? item.icon : null}
                      sx={{
                        color: "#fff",
                        justifyContent: !showLabel ? "center" : "flex-start",
                        py: 1.3,
                        borderRadius: 2,
                        fontWeight: isActive ? 600 : 400,
                        fontSize: "0.95rem",
                        backgroundColor: isActive
                          ? "rgba(255,255,255,0.25)"
                          : "transparent",
                        boxShadow: isActive
                          ? "0 0 12px rgba(255,255,255,0.4)"
                          : "none",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.35)",
                          transform: "scale(1.05)",
                          boxShadow: "0 0 15px rgba(255,255,255,0.5)",
                        },
                        textTransform: "none",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {showLabel ? item.label : item.icon}
                    </Button>
                  </Tooltip>
                );
              })}
            </Stack>
          </Stack>

          {/* --- LOGOUT SECTION --- */}
          <Tooltip title={collapsed && !isMobile ? "Logout" : ""} placement="right">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={(!collapsed || isMobile) ? <LogoutIcon /> : null}
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
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(255,255,255,0.4)",
                    transform: "scale(1.05)",
                    boxShadow: "0 0 15px rgba(255,255,255,0.4)",
                  },
                }}
              >
                {(!collapsed || isMobile) ? "Logout" : <LogoutIcon />}
              </Button>
            </motion.div>
          </Tooltip>
        </Stack>
      </Slide>
    </motion.div>
  );

  return (
    <>
      {/* --- Drawer for Mobile --- */}
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
              width: 260,
              boxShadow: "4px 0 20px rgba(0,0,0,0.25)",
              background:
                "linear-gradient(135deg, rgba(255,184,76,0.95), rgba(246,174,34,0.9))",
              color: "#fff",
              backdropFilter: "blur(15px)",
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
