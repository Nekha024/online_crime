import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/api';
import { FiGrid, FiShield, FiBarChart2, FiRadio, FiMessageSquare, FiLogOut } from 'react-icons/fi';
import '../../pages/admin/Admin.css';

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try { await api.post('/api/admin/logout/'); } catch(e){}
        localStorage.removeItem('adminAuth');
        navigate('/admin/login');
    };

    const isActive = (path) => location.pathname.includes(path) ? 'active' : '';

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <FiShield className="brand-icon" />
                    <h2>CrimeAI Admin</h2>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}><FiGrid /> <span>Dashboard</span></Link>
                    <Link to="/admin/stations" className={isActive('/admin/stations')}><FiShield /> <span>Station Manager</span></Link>
                    <Link to="/admin/stats" className={isActive('/admin/stats')}><FiBarChart2 /> <span>Analytics</span></Link>
                    <Link to="/admin/broadcast" className={isActive('/admin/broadcast')}><FiRadio /> <span>Broadcast</span></Link>
                    <Link to="/admin/queries" className={isActive('/admin/queries')}><FiMessageSquare /> <span>Queries</span></Link>
                </nav>
                <button onClick={handleLogout} className="logout-btn"><FiLogOut /> <span>Logout</span></button>
            </aside>
            <main className="admin-main">
                <header className="admin-header">
                    <h3>System Administration Command Center</h3>
                    <div className="admin-profile-badge">Super Admin</div>
                </header>
                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}