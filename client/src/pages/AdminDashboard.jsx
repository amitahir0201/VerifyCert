import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCertificates } from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total: 0, recent: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await getAllCertificates();
                setStats({ total: data.length, recent: data.slice(0, 5) });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const cards = [
        { label: 'Total Certificates', value: loading ? '…' : stats.total, icon: '🏆', color: 'from-cyan-500 to-blue-600' },
        { label: 'Upload New Batch', value: 'Excel →', icon: '📤', color: 'from-purple-500 to-pink-600', href: '/admin/upload' },
        { label: 'View All Certificates', value: 'List →', icon: '📋', color: 'from-green-500 to-teal-600', href: '/admin/certificates' },
    ];

    return (
        <div className="min-h-screen bg-gray-950 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
                    <p className="text-gray-400 mt-1">Manage certificates and track issuances</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {cards.map((c) => (
                        c.href ? (
                            <Link to={c.href} key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-6 text-white shadow-lg hover:scale-105 transition-transform cursor-pointer`}>
                                <div className="text-3xl mb-3">{c.icon}</div>
                                <div className="text-sm opacity-80 mb-1">{c.label}</div>
                                <div className="text-2xl font-bold">{c.value}</div>
                            </Link>
                        ) : (
                            <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-6 text-white shadow-lg`}>
                                <div className="text-3xl mb-3">{c.icon}</div>
                                <div className="text-sm opacity-80 mb-1">{c.label}</div>
                                <div className="text-2xl font-bold">{c.value}</div>
                            </div>
                        )
                    ))}
                </div>

                {/* Recent Certificates */}
                <div className="bg-gray-900 border border-gray-700/50 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
                        <h2 className="text-white font-semibold">Recent Certificates</h2>
                        <Link to="/admin/certificates" className="text-cyan-400 text-sm hover:underline">View all →</Link>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading…</div>
                    ) : stats.recent.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No certificates yet. <Link to="/admin/upload" className="text-cyan-400 hover:underline">Upload an Excel file</Link>.</div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase">
                                <tr>
                                    {['Certificate ID', 'Student Name', 'Domain', 'Issue Date'].map(h => (
                                        <th key={h} className="px-6 py-3 text-left">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {stats.recent.map((c) => (
                                    <tr key={c.certificateId} className="hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-cyan-400 text-sm">{c.certificateId}</td>
                                        <td className="px-6 py-4 text-white text-sm">{c.studentName}</td>
                                        <td className="px-6 py-4 text-gray-300 text-sm">{c.internshipDomain}</td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">{new Date(c.issueDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
