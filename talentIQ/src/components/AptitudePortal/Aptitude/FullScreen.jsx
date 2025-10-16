// FullscreenLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

export default function FullscreenLayout() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "#f9fbff",
      }}
    >
      <Outlet />
    </div>
  );
}
