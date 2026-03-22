import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = React.useState(false);
    const isAdmin = !!localStorage.getItem('adminToken');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        setIsOpen(false);
    };

    const isActive = (path) =>
        location.pathname === path ? 'text-cyan-400 font-semibold' : 'text-gray-300 hover:text-cyan-400';

    const NavLinks = () => (
        <>
            <Link to="/" onClick={() => setIsOpen(false)} className={`text-sm transition-colors ${isActive('/')}`}>Verify</Link>
            {isAdmin ? (
                <>
                    <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className={`text-sm transition-colors ${isActive('/admin/dashboard')}`}>Dashboard</Link>
                    <Link to="/admin/upload" onClick={() => setIsOpen(false)} className={`text-sm transition-colors ${isActive('/admin/upload')}`}>Upload</Link>
                    <Link to="/admin/certificates" onClick={() => setIsOpen(false)} className={`text-sm transition-colors ${isActive('/admin/certificates')}`}>Certificates</Link>
                    <button onClick={handleLogout} className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg transition-colors w-full md:w-auto">Logout</button>
                </>
            ) : (
                <Link to="/admin/login" onClick={() => setIsOpen(false)} className="text-sm bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1.5 rounded-lg transition-colors text-center">Admin Login</Link>
            )}
        </>
    );

    return (
        <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">CC</div>
                    <span className="text-white font-bold text-xl tracking-tight">CertiCreate</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <NavLinks />
                </div>

                {/* Mobile Toggle */}
                <button 
                    className="md:hidden text-gray-400 hover:text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-gray-900 border-t border-gray-800 px-6 py-4 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
                    <NavLinks />
                </div>
            )}
        </nav>
    );
};

export default Navbar;
