import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");

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
      {/* 🟦 Sidebar */}
      <Box
        sx={{
          position: "fixed",
          zIndex: 1200,
          height: "100vh",
          width: sidebarWidth,
          flexShrink: 0,
          transition: "width 0.3s ease",
          overflow: "hidden",
        }}
      >
        <AdminSidebar onCollapseChange={setCollapsed} />
      </Box>

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
