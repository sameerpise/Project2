import React, { useState } from "react";
import {
  Box,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  useMediaQuery,
  Slide,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleCollapseToggle = () => setCollapsed((prev) => !prev);

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
      {/* 🟦 AppBar (Top Bar for both Mobile & Desktop) */}


      {/* 🟪 Sidebar */}
      <Slide direction="right" in={!isMobile || mobileOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: isMobile ? "fixed" : "fixed",
            zIndex: isMobile ? 1200 : 1100,
            height: "100vh",
            width: sidebarWidth,
            flexShrink: 0,
            boxShadow: isMobile ? 6 : 0,
            bgcolor: "background.paper",
            borderRight: "1px solid #e0e0e0",
            transition: "width 0.3s ease",
            overflow: "hidden",
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
        {/* 🧭 Scrollable Content */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
            pr: 1,
            pb: 2,
            maxHeight: "calc(100vh - 64px)", // Prevent overflow beyond viewport
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
