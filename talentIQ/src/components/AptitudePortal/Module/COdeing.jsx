import React from "react";
import ModuleCard from "./Module";

export default function Machine({ unlocked }) {
  return (
    <ModuleCard
      title="Machine Coding Round"
      link="machine"
      unlocked={unlocked}
      completed={false}
      gradient="linear-gradient(90deg,#00b09b,#96c93d)"
    />
  );
}
