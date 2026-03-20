import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CertificateDetails from './pages/CertificateDetails';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UploadExcel from './pages/UploadExcel';
import CertificateList from './pages/CertificateList';
import CertificatePreview from './pages/CertificatePreview';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Navbar />
            <Routes>
                {/* Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/certificate/:certificateId" element={<CertificateDetails />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Protected */}
                <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                <Route path="/admin/upload" element={<PrivateRoute><UploadExcel /></PrivateRoute>} />
                <Route path="/admin/certificates" element={<PrivateRoute><CertificateList /></PrivateRoute>} />
                <Route path="/admin/preview/:certificateId" element={<PrivateRoute><CertificatePreview /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
