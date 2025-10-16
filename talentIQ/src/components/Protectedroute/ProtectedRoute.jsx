import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  // Load data based on role
  const studentToken = localStorage.getItem("studentToken");
  const studentUser = JSON.parse(localStorage.getItem("studentUser"));
  const adminToken = localStorage.getItem("adminToken");
  const adminUser = JSON.parse(localStorage.getItem("adminUser"));

  let isAuthenticated = false;
  let currentUser = null;

  if (role === "student" && studentToken && studentUser) {
    isAuthenticated = true;
    currentUser = studentUser;
  } else if (role === "admin" && adminToken && adminUser) {
    isAuthenticated = true;
    currentUser = adminUser;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Optional safety check
  if (role && currentUser.role !== role) return <Navigate to="/login" replace />;

  return children;
}
