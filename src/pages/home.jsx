import React, { useRef, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function Home() {
  const developerRef = useRef(null)
  const [isFixed, setIsFixed] = useState(true)

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsFixed(!entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    if (developerRef.current) {
      observer.observe(developerRef.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">ClearSky Web Application</h1>
      <p className="mb-3">
        Website ini dibuat untuk menunjang skripsi <b>Ilham Tatayo Lie (202265056)</b> dan <b>Ridho Nur Fauzi (202265060)</b>.
      </p>
      <p className="mb-3">
        Aplikasi ini digunakan untuk mendeteksi kondisi langit dan kemungkinan hujan menggunakan teknologi <b>Deep Learning</b>.
      </p>
      <p className="mb-3">
        Proses deteksi dilakukan dengan menggunakan kamera sebagai alat utama untuk pengambilan gambar langit, yang kemudian dianalisis oleh sistem.
      </p>
      <p className="mb-6">
        Silakan gunakan fitur kamera di bawah ini untuk melakukan uji hasil deteksi cuaca.
      </p>
      <div ref={developerRef} className="flex flex-col items-center mt-8">
        <img
          src="/assets/developer.jpg"
          alt="Developer"
          className="h-64 object-cover rounded-lg mb-4 shadow"
        />
        <span className="text-lg font-semibold mb-2">Developer</span>
        <NavLink
          to="/camera"
          className={`inline-block px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition ${isFixed ? 'fixed left-1/2 -translate-x-1/2 bottom-8 z-50' : ''}`}
          style={isFixed ? { position: 'fixed' } : {}}
        >
          Menuju Camera
        </NavLink>
      </div>
    </div>
  )
}
