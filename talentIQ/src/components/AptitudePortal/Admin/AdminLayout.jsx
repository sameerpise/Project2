import React, { useState } from "react";
import {
  Box,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleMobileDrawer = () => setMobileOpen(!mobileOpen);
  const toggleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <Box
      sx={{
        display: "flex",
        background: "linear-gradient(to top, #f9f9f9, #ffffff)",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* AppBar for mobile */}
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={2}
          sx={{
            bgcolor: "white",
            color: "#1976d2",
            borderBottom: "1px solid #eee",
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Admin Dashboard
            </Typography>
            <IconButton onClick={toggleMobileDrawer}>
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar for desktop */}
      {!isMobile && (
        <AdminSidebar
          collapsed={collapsed}
          onCollapseChange={setCollapsed}
        />
      )}

      {/* Drawer for mobile */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleMobileDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: 270,
              boxSizing: "border-box",
              background: "linear-gradient(135deg, #1976d2, #1565c0)",
            },
          }}
        >
          <AdminSidebar onClose={toggleMobileDrawer} />
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: "margin-left 0.3s ease",
          ml: !isMobile ? (collapsed ? "80px" : "270px") : 0,
          mt: isMobile ? "64px" : 0,
          p: { xs: 2, md: 4 },
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {/* Collapse Button (desktop only) */}
        {!isMobile && (
          <IconButton
            onClick={toggleCollapse}
            sx={{
              position: "absolute",
              top: 20,
              left: collapsed ? 85 : 275,
              transition: "left 0.3s ease",
              bgcolor: "white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              "&:hover": { bgcolor: "#f0f0f0" },
              zIndex: 1201,
            }}
          >
            {collapsed ? <MenuIcon /> : <CloseIcon />}
          </IconButton>
        )}

        {/* Page content */}
        <Outlet />
      </Box>
    </Box>
  );
}
