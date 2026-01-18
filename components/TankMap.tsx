"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function TankMap({ tanks }: { tanks: any[] }) {
  return (
    <MapContainer
      center={[41.0082, 28.9784]}
      zoom={4}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {tanks.map((t) => (
        <Marker key={t.tank_id} position={[t.lat, t.lon]}>
          <Popup>
            <div style={{ minWidth: 240 }}>
              <b>{t.tank_number}</b>
              <br />
              Place: {t.canonical_place}
              <br />
              Last: {t.event_type} ({t.event_time ?? "n/a"})
              <br />
              <hr />
              {t.pol} → {t.pod}
              <br />
              Renter: {t.renter_company ?? "n/a"}
              <br />
              Product: {t.loaded_product ?? "n/a"}
              <br />
              ETA: {t.eta ?? "n/a"}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}