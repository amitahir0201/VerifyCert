import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyCertificate } from '../services/api';

const CertificatePreview = () => {
    const { certificateId } = useParams();
    const navigate = useNavigate();
    const [cert, setCert] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        verifyCertificate(certificateId)
            .then(({ data }) => setCert(data))
            .catch(() => navigate('/admin/certificates'))
            .finally(() => setLoading(false));
    }, [certificateId]);

    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="animate-spin w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">← Back</button>
                    <h1 className="text-2xl font-bold text-white">Certificate Preview</h1>
                </div>

                {/* Certificate Template Preview */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 border-4 border-gray-700">
                    {/* Top Banner */}
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-800 py-8 px-10 text-center">
                        <div className="text-white/60 text-sm uppercase tracking-[0.3em] mb-2">CertiCreate</div>
                        <h2 className="text-white text-3xl font-extrabold tracking-wide">CERTIFICATE OF COMPLETION</h2>
                    </div>

                    {/* Body */}
                    <div className="bg-gradient-to-b from-blue-50 to-white p-10 text-center">
                        <p className="text-gray-500 text-base mb-3">This is to certify that</p>
                        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">{cert.studentName}</h1>
                        <p className="text-gray-500 mb-2">has successfully completed an internship in</p>
                        <p className="text-2xl font-bold text-blue-700 mb-5">{cert.internshipDomain}</p>
                        <p className="text-gray-600 text-base mb-8">
                            from <strong>{formatDate(cert.startDate)}</strong> to <strong>{formatDate(cert.endDate)}</strong>
                        </p>

                        {/* Bottom Row */}
                        <div className="flex items-end justify-between border-t-2 border-gray-200 pt-6 mt-4">
                            {/* QR Placeholder */}
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-3xl">
                                    🔲
                                </div>
                                <span className="text-gray-400 text-xs">Scan to Verify</span>
                            </div>

                            {/* Center Info */}
                            <div className="text-center">
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Certificate ID</p>
                                <p className="font-mono font-bold text-lg text-gray-700">{cert.certificateId}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatDate(cert.issueDate)}</p>
                            </div>

                            {/* Signature */}
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-24 border-b-2 border-gray-800 mb-1"></div>
                                <span className="text-gray-600 text-sm font-medium">Authorized Signature</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-6">
                    <a
                        href={`http://localhost:5000/api/certificates/download/${certificateId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg"
                    >
                        ⬇ Download PDF
                    </a>
                    <button
                        onClick={() => navigate(`/certificate/${certificateId}`)}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                        🔍 Public View
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CertificatePreview;
