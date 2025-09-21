import React from 'react';

export default function Footer() {
    return (
        <footer className="py-10 bg-white no-print">
            <div className="container mx-auto flex flex-col items-center justify-center">

                {/* Logo dan Deskripsi */}
                <div className="flex flex-col items-center mb-6">
                    <div className="flex gap-4 mb-4">
                        <img
                            src="/assets/logoUnipa.webp"
                            alt="Logo Universitas Papua"
                            className="w-16 h-16 object-contain"
                        />
                    </div>
                    <p className="text-center text-sm">
                        <strong>Universitas Papua &copy; Copyright 2025</strong>
                        <br />
                        Tahun 2025
                    </p>
                </div>
            </div>
        </footer>
    );
}