import React from "react";
import ModuleCard from "./Module";

export default function GD({ unlocked }) {
  return (
    <ModuleCard
      title="Group Discussion"
      link="gd"
      unlocked={unlocked}
      completed={false}
      gradient="linear-gradient(90deg,#43cea2,#185a9d)"
    />
  );
}
