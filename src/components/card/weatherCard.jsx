import React, { useEffect, useState } from 'react';
import { WiDaySunny, WiCloud, WiRain, WiThunderstorm, WiCloudy, WiHumidity, WiStrongWind, WiBarometer } from 'react-icons/wi';

/**
 * WeatherCard
 * Props:
 * - lat: number
 * - lng: number
 *
 * Uses OpenWeatherMap One Call/Current Weather API by coordinates.
 * Requires env: VITE_OPENWEATHER_API_KEY (set in project .env)
 * Example .env:
 *   VITE_OPENWEATHER_API_KEY=YOUR_KEY
 */
export default function WeatherCard({ lat, lng }) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!apiKey || lat == null || lng == null) return;

    const controller = new AbortController();
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=id`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error('Gagal memuat cuaca');
        const data = await res.json();
        setWeather(data);
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message);
      }
    };
    fetchWeather();
    return () => controller.abort();
  }, [lat, lng]);

  const pickIcon = (main) => {
    switch ((main || '').toLowerCase()) {
      case 'clear': return <WiDaySunny className="text-yellow-500" size={28} />;
      case 'clouds': return <WiCloudy className="text-gray-500" size={28} />;
      case 'rain': return <WiRain className="text-blue-500" size={28} />;
      case 'thunderstorm': return <WiThunderstorm className="text-purple-500" size={28} />;
      case 'drizzle': return <WiRain className="text-blue-400" size={28} />;
      case 'snow': return <WiCloud className="text-sky-400" size={28} />;
      default: return <WiCloud className="text-gray-400" size={28} />;
    }
  };

  const dayString = () => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const d = new Date();
    return days[d.getDay()];
  };

  if (!lat || !lng) return null;

  return (
    <div className="w-full bg-white rounded-lg shadow p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">Cuaca - {dayString()}</div>
        {weather && pickIcon(weather.weather?.[0]?.main)}
      </div>
      {error && <div className="text-xs text-red-600">{error}</div>}
      {!weather ? (
        <div className="text-xs text-gray-500">Memuat cuaca…</div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          <div className="col-span-2 font-medium">{weather.name || 'Lokasi Anda'}</div>
          <div className="flex items-center gap-2"><span className="font-medium">Suhu:</span> {Math.round(weather.main.temp)}°C</div>
          <div className="flex items-center gap-2"><span className="font-medium">Awan:</span> {weather.clouds?.all}%</div>
          <div className="flex items-center gap-2"><WiHumidity size={20}/> <span className="font-medium">Kelembapan:</span> {weather.main.humidity}%</div>
          <div className="flex items-center gap-2"><WiStrongWind size={20}/> <span className="font-medium">Angin:</span> {Math.round(weather.wind.speed)} m/s</div>
          <div className="flex items-center gap-2"><WiBarometer size={20}/> <span className="font-medium">Tekanan:</span> {weather.main.pressure} hPa</div>
          <div className="col-span-2 text-xs text-gray-500 capitalize">{weather.weather?.[0]?.description}</div>
        </div>
      )}
    </div>
  );
}
