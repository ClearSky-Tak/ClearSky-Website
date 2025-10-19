import React from 'react';

/**
 * LocationCard
 * Props:
 * - lat: number
 * - lng: number
 * - address?: string (optional human-readable location)
 */
export default function LocationCard({ lat, lng, address }) {
  if (lat == null || lng == null) return null;
  const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  return (
    <div className="w-full bg-white rounded-lg shadow p-3">
      <div className="text-sm font-semibold mb-2">Lokasi Saat Ini</div>
      <div className="w-full h-40 rounded overflow-hidden mb-2">
        <iframe
          title="Google Maps"
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="text-sm text-gray-700">
        <span className="font-medium">Lokasi: </span>
        {address ? address : `${lat.toFixed(5)}, ${lng.toFixed(5)}`}
      </div>
    </div>
  );
}
