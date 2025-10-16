import React, { useState, useEffect } from "react";
import ModuleCard from "./Module";

export default function Aptitude() {
  const [completed, setCompleted] = useState(
    localStorage.getItem("aptiCompleted") === "true"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setCompleted(localStorage.getItem("aptiCompleted") === "true");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <ModuleCard
      title="Aptitude"
      link="aptii"
      unlocked={true} // Aptitude is always unlocked
      completed={completed}
      gradient="linear-gradient(90deg,#ff9966,#ff5e62)"
    />
  );
}
