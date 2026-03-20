import React from 'react';
import { useNavigate } from 'react-router-dom';

const CertificateCard = ({ cert }) => {
    const navigate = useNavigate();
    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="bg-gray-900 border border-gray-700/50 rounded-2xl p-5 hover:border-cyan-500/40 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
            <div className="flex items-start justify-between mb-3">
                <span className="text-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2.5 py-1 rounded-full font-mono">
                    {cert.certificateId}
                </span>
                <span className="text-xs text-gray-500">{formatDate(cert.issueDate)}</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-1">{cert.studentName}</h3>
            <p className="text-gray-400 text-sm mb-1">{cert.internshipDomain}</p>
            <p className="text-gray-500 text-xs mb-4">{cert.email}</p>
            <div className="flex gap-2 pt-3 border-t border-gray-800">
                <button
                    onClick={() => navigate(`/certificate/${cert.certificateId}`)}
                    className="flex-1 text-xs bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                    View
                </button>
                <a
                    href={`http://localhost:5000/api/certificates/download/${cert.certificateId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-xs text-center bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 py-2 rounded-lg transition-colors"
                >
                    Download
                </a>
            </div>
        </div>
    );
};

export default CertificateCard;
