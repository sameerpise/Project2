import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Tooltip,
  useMediaQuery,
  Slide,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminSidebar from "./AdminSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../Redux/studentslice";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery("(max-width:900px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.student?.student || {});

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleCollapseToggle = () => setCollapsed((prev) => !prev);

  const sidebarWidth = collapsed ? 80 : 270;

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    // dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(to top, #f3f4f6, #ffffff)",
        overflow: "hidden",
      }}
    >
      {/* 🟦 Responsive AppBar */}
      <AppBar
        position="fixed"
        elevation={4}
        sx={{
          background: "linear-gradient(135deg, #1976d2, #1565c0)",
          color: "#fff",
          zIndex: 2000,
          transition: "all 0.3s ease",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>
          {/* Left Section */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <Tooltip title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
              <IconButton
                onClick={() => (isMobile ? handleDrawerToggle() : handleCollapseToggle())}
                sx={{
                  color: "#fff",
                  background: "rgba(255,255,255,0.1)",
                  "&:hover": { background: "rgba(255,255,255,0.25)" },
                }}
              >
                {isMobile ? <MenuIcon /> : collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </Tooltip>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                letterSpacing: 0.5,
                display: { xs: "none", sm: "block" },
              }}
            >
              Admin Dashboard
            </Typography>
          </Box>

          {/* Right Section */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <Tooltip title="Profile">
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar
                  src={admin?.avatar || "/admin.png"}
                  alt={admin?.fullName || "Admin"}
                  sx={{ width: 40, height: 40, border: "2px solid white" }}
                />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                  borderRadius: 2,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Typography variant="body2" sx={{ px: 2, pt: 1, fontWeight: 600 }}>
                {admin?.fullName || "Admin User"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ px: 2, pb: 1, color: "text.secondary" }}
              >
                {admin?.email || "admin@example.com"}
              </Typography>
              <Divider />
              <MenuItem onClick={() => navigate("/admin/profile")}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ fontSize: 18, mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 🟪 Sidebar */}
      <Slide direction="right" in={!isMobile || mobileOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "fixed",
            zIndex: 1200,
            top: 0,
            left: 0,
            height: "100vh",
            width: sidebarWidth,
            flexShrink: 0,
            boxShadow: isMobile ? 6 : 0,
            bgcolor: "background.paper",
            transition: "width 0.3s ease",
            overflow: "hidden",
            pt: 8, // push below AppBar
          }}
        >
          <AdminSidebar
            onClose={handleDrawerToggle}
            onCollapseChange={setCollapsed}
            collapsed={collapsed}
          />
        </Box>
      </Slide>

      {/* 🟨 Main Content Area */}
      <Box
        component={motion.main}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        sx={{
          flexGrow: 1,
          mt: "64px", // below AppBar
          ml: { xs: 0, md: `${sidebarWidth}px` },
          background: "linear-gradient(to bottom right, #f8fafc, #ffffff)",
          borderTopLeftRadius: { md: 24 },
          borderBottomLeftRadius: { md: 24 },
          boxShadow: { md: "inset 4px 0px 20px rgba(0,0,0,0.05)" },
          transition: "margin 0.3s ease",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
            pr: 1,
            pb: 2,
            maxHeight: "calc(100vh - 64px)",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#bdbdbd",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#9e9e9e",
            },
          }}
        >
          <Box
            sx={{
              maxWidth: "1400px",
              mx: "auto",
              borderRadius: 3,
              p: { xs: 1, sm: 2 },
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
