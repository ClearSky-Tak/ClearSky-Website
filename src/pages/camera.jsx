import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

export default function Camera() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [result, setResult] = useState({
        langit: 'benar', // atau 'bukan'
        keadaan: 'cerah', // atau 'mendung', 'hujan'
        kemungkinanHujan: 20, // persen
    });
    const navigate = useNavigate();

    // Mulai kamera saat komponen mount
    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            });
        }
    }, []);

    // Fungsi untuk capture frame dari video
    const getCurrentFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/png');
    };

    // Fungsi untuk membuat dan mendownload PDF
    const handleReport = () => {
        const imgData = getCurrentFrame();
        navigate('/report', {
            state: {
                imgData,
                result
            }
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Area Kamera */}
                <div className="md:w-1/2 flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4">Area Kamera</h2>
                    <video ref={videoRef} className="w-full rounded shadow mb-4" autoPlay />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>

                {/* Area Hasil Deteksi */}
                <div className="md:w-1/2 flex flex-col items-center justify-center my-auto">
                    <h2 className="text-xl font-bold mb-4">Hasil Deteksi</h2>
                    <div className="flex justify-center w-full mb-10">
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
                    <button
                        onClick={handleReport}
                        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-800 transition font-semibold shadow"
                    >
                        Report PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
