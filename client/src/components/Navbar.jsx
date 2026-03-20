import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = !!localStorage.getItem('adminToken');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const isActive = (path) =>
        location.pathname === path ? 'text-cyan-400 font-semibold' : 'text-gray-300 hover:text-cyan-400';

    return (
        <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">CC</div>
                    <span className="text-white font-bold text-xl tracking-tight">CertiCreate</span>
                </Link>
                <div className="flex items-center gap-6">
                    <Link to="/" className={`text-sm transition-colors ${isActive('/')}`}>Verify</Link>
                    {isAdmin ? (
                        <>
                            <Link to="/admin/dashboard" className={`text-sm transition-colors ${isActive('/admin/dashboard')}`}>Dashboard</Link>
                            <Link to="/admin/upload" className={`text-sm transition-colors ${isActive('/admin/upload')}`}>Upload</Link>
                            <Link to="/admin/certificates" className={`text-sm transition-colors ${isActive('/admin/certificates')}`}>Certificates</Link>
                            <button onClick={handleLogout} className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg transition-colors">Logout</button>
                        </>
                    ) : (
                        <Link to="/admin/login" className="text-sm bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1.5 rounded-lg transition-colors">Admin Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
