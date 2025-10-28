import React, { useState } from "react";
import {
  Box,
  useMediaQuery,
  Drawer,
  IconButton,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");

  const handleCollapseToggle = () => setCollapsed((prev) => !prev);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const sidebarWidth = collapsed ? 80 : 270;

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "linear-gradient(to top, #f3f4f6, #ffffff)",
        overflow: "hidden",
      }}
    >
      {/* 🟦 Sidebar for Desktop */}
      {!isMobile && (
        <motion.div
          initial={{ width: sidebarWidth }}
          animate={{ width: sidebarWidth }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            height: "100vh",
            zIndex: 1200,
            overflow: "hidden",
          }}
        >
          <AdminSidebar
            onCollapseChange={setCollapsed}
            collapsed={collapsed}
          />
        </motion.div>
      )}

      {/* 🟪 Drawer Sidebar for Mobile */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: 270,
              background:
                "linear-gradient(135deg, rgba(33,150,243,0.95), rgba(30,136,229,0.9))",
              color: "#fff",
              backdropFilter: "blur(15px)",
              boxShadow: "4px 0 15px rgba(0,0,0,0.3)",
            },
          }}
        >
          <AdminSidebar
            onClose={handleDrawerToggle}
            collapsed={false}
          />
        </Drawer>
      )}

      {/* 🟨 Main Content */}
      <Box
        component={motion.main}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        sx={{
          flexGrow: 1,
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
        {/* 🧭 Single Hamburger Icon (Only on Mobile) */}
        {isMobile && (
          <Tooltip title="Menu">
            <IconButton
              onClick={handleDrawerToggle}
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
          </Tooltip>
        )}

        {/* 🧭 Scrollable Content */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
            pr: 1,
            pb: 2,
            maxHeight: "100vh",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
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
