import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Default Leaflet marker icons reference bundled assets that don't resolve
// correctly under Vite - point them at the CDN copies explicitly.
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function MapView({ facilities = [], center, height = '420px' }) {
  const mapCenter = center || (facilities[0]?.location ? [facilities[0].location.lat, facilities[0].location.lng] : [28.6692, 77.4538]);

  return (
    <div style={{ height }} className="overflow-hidden rounded-2xl border border-black/5">
      <MapContainer center={mapCenter} zoom={11} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {facilities.map((f) => (
          <Marker key={f._id} position={[f.location.lat, f.location.lng]} icon={defaultIcon}>
            <Popup>
              <p className="font-semibold">{f.name}</p>
              <p>{f.city}</p>
              {f.distanceKm != null && <p>{f.distanceKm} km away</p>}
              {f.availability && (
                <p>
                  Beds: {f.availability.beds} · Blood: {f.availability.blood} · O₂: {f.availability.oxygen}
                </p>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
