"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Import the map component with SSR disabled
const TankMap = dynamic(() => import("@/components/TankMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      Loading map...
    </div>
  ),
});

export default function Home() {
  const [tanks, setTanks] = useState([]);

  useEffect(() => {
    fetch("/api/map/tanks")
      .then((r) => r.json())
      .then(setTanks);
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <TankMap tanks={tanks} />
    </div>
  );
}