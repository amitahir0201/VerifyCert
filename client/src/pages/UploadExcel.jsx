import React, { useState } from 'react';
import { uploadExcel } from '../services/api';

const UploadExcel = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [dragging, setDragging] = useState(false);

    const handleFile = (f) => {
        if (f && (f.name.endsWith('.xlsx') || f.name.endsWith('.xls') || f.name.endsWith('.csv'))) {
            setFile(f);
            setError('');
        } else {
            setError('Only .xlsx, .xls, or .csv files are accepted.');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) { setError('Please select a file first.'); return; }
        setLoading(true);
        setResult(null);
        setError('');
        try {
            const fd = new FormData();
            fd.append('file', file);
            const { data } = await uploadExcel(fd);
            setResult(data);
            setFile(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-white">Upload Excel File</h1>
                    <p className="text-gray-400 mt-1">Bulk-generate certificates from candidate data</p>
                </div>

                {/* Template Info */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6 text-sm text-blue-300">
                    <p className="font-semibold mb-2">📋 Required Excel Columns:</p>
                    <code className="text-xs bg-gray-800 px-3 py-1 rounded-lg flex gap-6 flex-wrap">
                        {['Student Name', 'Email', 'Domain', 'Start Date', 'End Date'].map(c => (
                            <span key={c}>{c}</span>
                        ))}
                    </code>
                </div>

                {/* Drop Zone */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer mb-6 ${dragging ? 'border-cyan-400 bg-cyan-500/10' : 'border-gray-600 hover:border-gray-500 bg-gray-900/40'}`}
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    <div className="text-5xl mb-4">{file ? '✅' : '📂'}</div>
                    <p className="text-white font-semibold mb-1">{file ? file.name : 'Drag & drop or click to browse'}</p>
                    <p className="text-gray-500 text-sm">{file ? `${(file.size / 1024).toFixed(1)} KB` : 'Supports .xlsx, .xls, .csv'}</p>
                    <input id="fileInput" type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading || !file}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg"
                >
                    {loading ? 'Processing & Generating Certificates…' : '🚀 Generate Certificates'}
                </button>

                {/* Results */}
                {result && (
                    <div className="mt-8 bg-gray-900 border border-green-500/30 rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 bg-green-500/10 border-b border-green-500/20">
                            <h3 className="text-green-400 font-semibold">✓ {result.message}</h3>
                        </div>
                        <table className="w-full">
                            <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left">Student</th>
                                    <th className="px-6 py-3 text-left">Certificate ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {result.certificates.map((c) => (
                                    <tr key={c.certificateId}>
                                        <td className="px-6 py-3 text-white text-sm">{c.studentName}</td>
                                        <td className="px-6 py-3 font-mono text-cyan-400 text-sm">{c.certificateId}</td>
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

export default UploadExcel;
