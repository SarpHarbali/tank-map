"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function Home() {
  const [tanks, setTanks] = useState([]);

  useEffect(() => {
    fetch("/api/map/tanks")
      .then((r) => r.json())
      .then(setTanks);
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <MapContainer center={[41.0082, 28.9784]} zoom={4} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {tanks.map((t) => (
          <Marker key={t.tank_id} position={[t.lat, t.lon]}>
            <Popup>
              <div style={{ minWidth: 240 }}>
                <b>{t.tank_number}</b><br />
                Place: {t.canonical_place}<br />
                Last: {t.event_type} ({t.event_time ?? "n/a"})<br />
                <hr />
                {t.pol} → {t.pod}<br />
                Renter: {t.renter_company ?? "n/a"}<br />
                Product: {t.loaded_product ?? "n/a"}<br />
                ETA: {t.eta ?? "n/a"}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
