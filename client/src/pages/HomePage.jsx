import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [certId, setCertId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleVerify = (e) => {
        e.preventDefault();
        if (!certId.trim()) {
            setError('Please enter a Certificate ID');
            return;
        }
        navigate(`/certificate/${certId.trim().toUpperCase()}`);
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium">
                    ✦ Instant Certificate Verification
                </div>
                <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
                    Verify Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Certificate</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-md mx-auto">
                    Enter your Certificate ID below to instantly verify your internship certificate and download it.
                </p>
            </div>

            {/* Search Card */}
            <div className="w-full max-w-lg bg-gray-900/60 backdrop-blur border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                <form onSubmit={handleVerify} className="flex flex-col gap-4">
                    <label className="text-gray-300 text-sm font-medium">Certificate ID</label>
                    <input
                        type="text"
                        value={certId}
                        onChange={(e) => { setCertId(e.target.value); setError(''); }}
                        placeholder="e.g. A1B2C3D4"
                        className="w-full bg-gray-800 border border-gray-600 focus:border-cyan-500 text-white px-4 py-3 rounded-xl outline-none transition-colors text-lg tracking-widest placeholder-gray-500"
                    />
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 text-lg"
                    >
                        Verify Certificate →
                    </button>
                </form>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl w-full">
                {[
                    { icon: '🔒', title: 'Secure', desc: 'Certificates stored securely in MongoDB' },
                    { icon: '⚡', title: 'Instant', desc: 'Real-time verification results' },
                    { icon: '📄', title: 'Downloadable', desc: 'Download your PDF certificate anytime' },
                ].map((f) => (
                    <div key={f.title} className="text-center p-4 rounded-xl bg-gray-900/40 border border-gray-800">
                        <div className="text-3xl mb-2">{f.icon}</div>
                        <div className="text-white font-semibold text-sm mb-1">{f.title}</div>
                        <div className="text-gray-500 text-xs">{f.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
