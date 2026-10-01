import os

files = {
    'frontend/src/pages/admin/AdminLogin.js': '''import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './Admin.css';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/admin/login/', { email, password });
            if (res.data.success) {
                localStorage.setItem('adminAuth', 'true');
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h2>System Admin Login</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Admin Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
                    <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}''',

    'frontend/src/components/admin/AdminProtectedRoute.js': '''import React from 'react';
import { Navigate } from 'react-router-dom';

export default function AdminProtectedRoute({ children }) {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
}''',

    'frontend/src/components/admin/AdminLayout.js': '''import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import '../../pages/admin/Admin.css';

export default function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try { await api.post('/api/admin/logout/'); } catch(e){}
        localStorage.removeItem('adminAuth');
        navigate('/admin/login');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h2>Admin Portal</h2>
                <nav>
                    <Link to="/admin/dashboard">Dashboard</Link>
                    <Link to="/admin/stations">Station Manager</Link>
                    <Link to="/admin/stats">Station Stats</Link>
                    <Link to="/admin/broadcast">Broadcast</Link>
                    <Link to="/admin/queries">Queries</Link>
                </nav>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </aside>
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}''',

    'frontend/src/pages/admin/AdminDashboard.js': '''import React from 'react';
export default function AdminDashboard() {
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome to the System Admin control center. Use the sidebar to manage stations, broadcast alerts, and view statistics.</p>
        </div>
    );
}''',

    'frontend/src/pages/admin/Admin.css': '''.admin-login-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f4f7f6; }
.admin-login-box { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 300px; display: flex; flex-direction: column; gap: 1rem; }
.admin-login-box form { display: flex; flex-direction: column; gap: 1rem; }
.admin-login-box input { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
.admin-login-box button { padding: 0.5rem; background: #002147; color: white; border: none; border-radius: 4px; cursor: pointer; }
.admin-layout { display: flex; min-height: 100vh; }
.admin-sidebar { width: 250px; background: #002147; color: white; display: flex; flex-direction: column; padding: 1rem; }
.admin-sidebar h2 { margin-bottom: 2rem; }
.admin-sidebar nav { display: flex; flex-direction: column; gap: 1rem; flex: 1; }
.admin-sidebar nav a { color: white; text-decoration: none; }
.admin-main { flex: 1; padding: 2rem; background: #f4f7f6; }
.logout-btn { background: #d9534f; color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer; }
.admin-form { display: flex; flex-direction: column; gap: 1rem; max-width: 500px; margin-bottom: 2rem;}
.admin-form input, .admin-form textarea { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
.admin-form button { padding: 0.5rem; background: #002147; color: white; border: none; border-radius: 4px; cursor: pointer; }
.admin-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
.admin-table th, .admin-table td { padding: 0.75rem; border: 1px solid #ddd; text-align: left; }
.admin-table th { background: #002147; color: white; }'''
}

for path, content in files.items():
    with open(path, 'w') as f:
        f.write(content)
print('Files created.')
