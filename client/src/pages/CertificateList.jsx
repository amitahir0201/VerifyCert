import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCertificates, deleteCertificate } from '../services/api';

const CertificateList = () => {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        setLoading(true);
        try {
            const { data } = await getAllCertificates();
            setCerts(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Delete certificate ${id}? This action is irreversible.`)) return;
        setDeleting(id);
        try {
            await deleteCertificate(id);
            setCerts(certs.filter(c => c.certificateId !== id));
        } catch (e) {
            alert('Failed to delete certificate.');
        } finally {
            setDeleting(null);
        }
    };

    const filtered = certs.filter(c =>
        c.studentName.toLowerCase().includes(search.toLowerCase()) ||
        c.certificateId.toLowerCase().includes(search.toLowerCase()) ||
        c.internshipDomain.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-950 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white">All Certificates</h1>
                        <p className="text-gray-400 mt-1">{certs.length} certificate{certs.length !== 1 ? 's' : ''} stored</p>
                    </div>
                    <Link to="/admin/upload" className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                        + Upload New
                    </Link>
                </div>

                {/* Search */}
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, ID or domain…"
                    className="w-full bg-gray-900 border border-gray-700 focus:border-cyan-500 text-white px-4 py-3 rounded-xl outline-none mb-6 transition-colors"
                />

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center text-gray-500 py-16">No certificates found.</div>
                ) : (
                    <div className="bg-gray-900 border border-gray-700/50 rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase">
                                <tr>
                                    {['Certificate ID', 'Student Name', 'Email', 'Domain', 'Issue Date', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-3 text-left">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filtered.map((c) => (
                                    <tr key={c.certificateId} className="hover:bg-gray-800/30 transition-colors">
                                        <td className="px-5 py-4 font-mono text-cyan-400 text-sm">{c.certificateId}</td>
                                        <td className="px-5 py-4 text-white text-sm font-medium">{c.studentName}</td>
                                        <td className="px-5 py-4 text-gray-400 text-sm">{c.email}</td>
                                        <td className="px-5 py-4 text-gray-300 text-sm">{c.internshipDomain}</td>
                                        <td className="px-5 py-4 text-gray-400 text-sm">{new Date(c.issueDate).toLocaleDateString()}</td>
                                        <td className="px-5 py-4 flex items-center gap-2">
                                            <Link
                                                to={`/admin/preview/${c.certificateId}`}
                                                className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                Preview
                                            </Link>
                                            <a
                                                href={`http://localhost:5000/api/certificates/download/${c.certificateId}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                Download
                                            </a>
                                            <button
                                                onClick={() => handleDelete(c.certificateId)}
                                                disabled={deleting === c.certificateId}
                                                className="text-xs bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {deleting === c.certificateId ? '…' : 'Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CertificateList;
