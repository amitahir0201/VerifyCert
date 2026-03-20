import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyCertificate } from '../services/api';

const CertificateDetails = () => {
    const { certificateId } = useParams();
    const navigate = useNavigate();
    const [cert, setCert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCert = async () => {
            try {
                const { data } = await verifyCertificate(certificateId);
                setCert(data);
            } catch {
                setError('Certificate not found. Please check the ID and try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchCert();
    }, [certificateId]);

    const handleDownload = () => {
        window.open(`http://localhost:5000/api/certificates/download/${certificateId}`, '_blank');
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="animate-spin w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-white mb-2">Certificate Not Found</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button onClick={() => navigate('/')} className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg">Go Back</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl">
                {/* Verified Badge */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-1.5 rounded-full text-sm font-medium">
                        ✓ Certificate Verified
                    </span>
                </div>

                {/* Certificate Card */}
                <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-8 text-center">
                        <h2 className="text-white text-2xl font-bold tracking-wide">CERTIFICATE OF COMPLETION</h2>
                    </div>

                    {/* Body */}
                    <div className="p-8 text-center">
                        <p className="text-gray-400 mb-1">This is to certify that</p>
                        <h1 className="text-3xl font-extrabold text-white mb-1">{cert.studentName}</h1>
                        <p className="text-gray-400 mb-1">has successfully completed an internship in</p>
                        <p className="text-xl font-bold text-cyan-400 mb-4">{cert.internshipDomain}</p>
                        <p className="text-gray-300 mb-6">
                            from <strong>{formatDate(cert.startDate)}</strong> to <strong>{formatDate(cert.endDate)}</strong>
                        </p>

                        <div className="grid grid-cols-2 gap-4 bg-gray-800/50 rounded-xl p-5 mb-6 text-left">
                            {[
                                { label: 'Certificate ID', value: cert.certificateId },
                                { label: 'Issue Date', value: formatDate(cert.issueDate) },
                                { label: 'Email', value: cert.email },
                                { label: 'Domain', value: cert.internshipDomain },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</p>
                                    <p className="text-white font-medium text-sm">{value}</p>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleDownload}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                        >
                            ⬇ Download Certificate PDF
                        </button>
                    </div>
                </div>

                <button onClick={() => navigate('/')} className="mt-6 text-gray-500 hover:text-gray-300 text-sm flex items-center gap-1 transition-colors">
                    ← Verify another certificate
                </button>
            </div>
        </div>
    );
};

export default CertificateDetails;
