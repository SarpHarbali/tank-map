"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LayoutDashboard } from "lucide-react"; // Import the icon

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
    // Added 'position: relative' so the absolute button positions correctly inside this div
    <div style={{ height: "100vh", position: "relative" }}>
      <TankMap tanks={tanks} />
      
      {/* Floating Admin Button */}
      <a 
        href="/admin/tanks"
        className="absolute top-5 right-5 z-[1000] flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-md shadow-lg hover:bg-gray-50 border border-gray-200 font-medium transition-colors"
      >
        <LayoutDashboard className="w-4 h-4" />
        Admin Panel
      </a>
    </div>
  );
}