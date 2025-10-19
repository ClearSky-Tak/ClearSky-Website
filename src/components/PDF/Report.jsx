import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';

export default function Report() {
  const { state } = useLocation();
  const imgData = state?.imgData;
  const result = state?.result || { langit: '', keadaan: '', kemungkinanHujan: '' };

  return (
    <div className="bg-white p-8 print:p-0 min-h-screen font-sans">
      {/* Header */}
      <div className="flex items-center mb-6">
        <img
          src="/assets/logoUnipa.webp"
          alt="Logo Universitas Papua"
          className="w-20 h-20 object-contain mr-4"
          style={{ marginLeft: '8px' }}
        />
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-right">ClearSky</span>
          <span className="text-lg text-right mt-1">Universitas Papua</span>
        </div>
      </div>

      {/* Judul Hasil */}
      <div className="text-center mt-8 mb-4">
        <span className="text-2xl font-bold">Hasil</span>
      </div>

      {/* Gambar hasil capture */}
      {imgData && (
        <div className="flex justify-center mb-6">
          <img
            src={imgData}
            alt="Capture"
            className="rounded-lg shadow-lg max-w-xl w-full"
            style={{ border: '2px solid #eee' }}
          />
        </div>
      )}

      {/* Tabel Result */}
      <div className="flex justify-center">
        <table className="w-full max-w-xl border-collapse rounded-lg overflow-hidden shadow-lg bg-white">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-3 px-4 text-lg font-semibold">Hasil</th>
              <th className="py-3 px-4 text-lg font-semibold">Nilai</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50">
              <td className="py-2 px-4 font-semibold">Langit</td>
              <td className="py-2 px-4">
                <span className={`px-3 py-1 rounded text-white text-sm font-bold ${result.langit === 'benar' ? 'bg-green-500' : 'bg-red-500'}`}>
                  {result.langit === 'benar' ? 'Benar' : 'Bukan'}
                </span>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-semibold">Keadaan</td>
              <td className="py-2 px-4">{result.keadaan}</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-2 px-4 font-semibold">Kemungkinan Hujan</td>
              <td className="py-2 px-4">{result.kemungkinanHujan}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Print Button */}
      <div className="flex justify-center mt-8 not-print">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-800 transition font-semibold shadow not-print"
        >
          Print/Save as PDF
        </button>
        <NavLink to="/camera"
          className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-600 transition font-semibold shadow no-print"
        >
          Back to Camera
        </NavLink>
      </div>
    </div>
  );
}