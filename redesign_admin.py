import os

files = {}

# 1. AdminLayout with icons
files['frontend/src/components/admin/AdminLayout.js'] = '''import React from 'react';
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
}'''

# 2. AdminDashboard with Recharts
files['frontend/src/pages/admin/AdminDashboard.js'] = '''import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiAlertCircle, FiCheckCircle, FiClock, FiActivity } from 'react-icons/fi';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/api/admin/dashboard-stats/')
           .then(res => setStats(res.data.stats))
           .catch(err => console.error(err));
    }, []);

    if (!stats) return <div className="loading-spinner">Loading dashboard analytics...</div>;

    const pieData = [
        { name: 'Solved', value: stats.total_solved, color: '#10b981' },
        { name: 'Pending', value: stats.total_pending, color: '#f59e0b' }
    ];

    const barData = [
        { name: 'Total Cases', amount: stats.total_cases },
        { name: 'Solved', amount: stats.total_solved },
        { name: 'Pending', amount: stats.total_pending },
        { name: 'Critical', amount: stats.high_critical_cases },
    ];

    return (
        <div className="dashboard-container fade-in">
            <h1 className="page-title">Global Overview</h1>
            
            <div className="dashboard-cards">
                <div className="dash-card primary">
                    <div className="card-icon"><FiActivity /></div>
                    <div className="card-info">
                        <h3>Total Cases</h3>
                        <div className="stat-number">{stats.total_cases}</div>
                    </div>
                </div>
                <div className="dash-card success">
                    <div className="card-icon"><FiCheckCircle /></div>
                    <div className="card-info">
                        <h3>Total Solved</h3>
                        <div className="stat-number">{stats.total_solved}</div>
                    </div>
                </div>
                <div className="dash-card warning">
                    <div className="card-icon"><FiClock /></div>
                    <div className="card-info">
                        <h3>Total Pending</h3>
                        <div className="stat-number">{stats.total_pending}</div>
                    </div>
                </div>
                <div className="dash-card danger">
                    <div className="card-icon"><FiAlertCircle /></div>
                    <div className="card-info">
                        <h3>Critical Priority</h3>
                        <div className="stat-number">{stats.high_critical_cases}</div>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Case Resolution Ratio</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label>
                                {pieData.map((entry, index) => <Cell key={cell-\} fill={entry.color} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart-card">
                    <h3>Volume Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip cursor={{fill: '#f4f4f5'}}/>
                            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="recent-activity-card">
                <h3>Recent System Activity</h3>
                <div className="table-responsive">
                    <table className="admin-modern-table">
                        <thead>
                            <tr>
                                <th>Case ID</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Date Filed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recent_cases.map(c => (
                                <tr key={c.id}>
                                    <td className="fw-bold">{c.id}</td>
                                    <td>{c.title}</td>
                                    <td><span className={"status-pill " + c.status.toLowerCase().replace(' ', '-')}>{c.status}</span></td>
                                    <td className="text-muted">{c.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}'''

# 3. New Advanced CSS
files['frontend/src/pages/admin/Admin.css'] = '''
/* Variables & Base Styles */
:root {
  --admin-bg: #f8fafc;
  --admin-sidebar: #0f172a;
  --admin-primary: #3b82f6;
  --admin-success: #10b981;
  --admin-warning: #f59e0b;
  --admin-danger: #ef4444;
  --admin-text-main: #1e293b;
  --admin-text-muted: #64748b;
  --admin-border: #e2e8f0;
  --admin-card-bg: #ffffff;
}

body { margin: 0; font-family: 'Inter', sans-serif; background-color: var(--admin-bg); }

/* Layout & Sidebar */
.admin-layout { display: flex; height: 100vh; overflow: hidden; }

.admin-sidebar { width: 260px; background: var(--admin-sidebar); color: #fff; display: flex; flex-direction: column; transition: all 0.3s ease; }
.admin-brand { padding: 2rem 1.5rem; display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.brand-icon { font-size: 1.5rem; color: var(--admin-primary); }
.admin-brand h2 { margin: 0; font-size: 1.25rem; font-weight: 700; letter-spacing: 0.5px; }

.admin-nav { flex: 1; padding: 1.5rem 0; display: flex; flex-direction: column; gap: 0.5rem; }
.admin-nav a { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1.5rem; color: #94a3b8; text-decoration: none; font-weight: 500; transition: all 0.2s ease; border-left: 3px solid transparent; }
.admin-nav a:hover, .admin-nav a.active { color: #fff; background: rgba(255,255,255,0.05); border-left-color: var(--admin-primary); }
.admin-nav a svg { font-size: 1.2rem; }

.logout-btn { background: transparent; color: #f87171; border: none; padding: 1rem 1.5rem; display: flex; align-items: center; gap: 1rem; cursor: pointer; font-size: 1rem; font-weight: 500; border-top: 1px solid rgba(255,255,255,0.1); transition: all 0.2s; }
.logout-btn:hover { background: rgba(248, 113, 113, 0.1); color: #ef4444; }

/* Main Content Area */
.admin-main { flex: 1; display: flex; flex-direction: column; overflow-y: auto; background-color: var(--admin-bg); }
.admin-header { background: #fff; padding: 1.25rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); z-index: 10; }
.admin-header h3 { margin: 0; color: var(--admin-text-main); font-weight: 600; font-size: 1.1rem; }
.admin-profile-badge { background: #e0e7ff; color: #4338ca; padding: 0.4rem 1rem; border-radius: 20px; font-weight: 600; font-size: 0.85rem; }
.admin-content { padding: 2rem; }

.page-title { margin-top: 0; margin-bottom: 1.5rem; color: var(--admin-text-main); font-size: 1.75rem; font-weight: 700; }

/* Dashboard Cards */
.dashboard-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.dash-card { background: var(--admin-card-bg); border-radius: 12px; padding: 1.5rem; display: flex; align-items: center; gap: 1.25rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: transform 0.2s; }
.dash-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
.card-icon { width: 56px; height: 56px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.5rem; }
.dash-card.primary .card-icon { background: #eff6ff; color: var(--admin-primary); }
.dash-card.success .card-icon { background: #ecfdf5; color: var(--admin-success); }
.dash-card.warning .card-icon { background: #fffbeb; color: var(--admin-warning); }
.dash-card.danger .card-icon { background: #fef2f2; color: var(--admin-danger); }

.card-info h3 { margin: 0 0 0.25rem 0; font-size: 0.9rem; color: var(--admin-text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.card-info .stat-number { font-size: 2rem; font-weight: 800; color: var(--admin-text-main); line-height: 1; }

/* Charts Area */
.charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.chart-card { background: var(--admin-card-bg); border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
.chart-card h3 { margin: 0 0 1.5rem 0; color: var(--admin-text-main); font-weight: 600; }

/* Modern Tables */
.recent-activity-card { background: var(--admin-card-bg); border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
.recent-activity-card h3 { margin: 0 0 1.5rem 0; color: var(--admin-text-main); font-weight: 600; }
.table-responsive { overflow-x: auto; }
.admin-modern-table { width: 100%; border-collapse: separate; border-spacing: 0; }
.admin-modern-table th { background: #f8fafc; color: var(--admin-text-muted); font-weight: 600; text-align: left; padding: 1rem; border-bottom: 1px solid var(--admin-border); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }
.admin-modern-table td { padding: 1rem; border-bottom: 1px solid var(--admin-border); color: var(--admin-text-main); font-size: 0.95rem; }
.admin-modern-table tr:last-child td { border-bottom: none; }
.admin-modern-table tbody tr:hover { background: #f8fafc; }

/* Status Pills */
.status-pill { padding: 0.35rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; }
.status-pill.resolved, .status-pill.closed { background: #dcfce7; color: #166534; }
.status-pill.pending, .status-pill.submitted { background: #fef9c3; color: #854d0e; }
.status-pill.under-investigation, .status-pill.assigned { background: #e0f2fe; color: #075985; }

/* Utilities */
.fw-bold { font-weight: 600; }
.text-muted { color: var(--admin-text-muted); }
.fade-in { animation: fadeIn 0.4s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Forms & Inputs */
.admin-form-group { display: flex; flex-direction: column; gap: 1rem; max-width: 600px; }
.admin-input { width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--admin-border); border-radius: 8px; font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
.admin-input:focus { border-color: var(--admin-primary); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
.admin-btn { background: var(--admin-primary); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.admin-btn:hover { background: #2563eb; }
.admin-btn.danger { background: var(--admin-danger); }
.admin-btn.danger:hover { background: #dc2626; }
'''

# 4. Refactor Station Manager
files['frontend/src/pages/admin/AdminStationManager.js'] = '''import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { FiPlus, FiTrash2, FiEye, FiX } from 'react-icons/fi';

export default function AdminStationManager() {
    const [stations, setStations] = useState([]);
    const [formData, setFormData] = useState({ station_name: '', station_code: '', police_district: '', username: '' });
    const [selectedStation, setSelectedStation] = useState(null);

    const fetchStations = async () => {
        const res = await api.get('/api/admin/stations/');
        setStations(res.data.stations);
    };

    useEffect(() => { fetchStations(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        await api.post('/api/admin/stations/', formData);
        setFormData({ station_name: '', station_code: '', police_district: '', username: '' });
        fetchStations();
    };

    const handleDelete = async (id) => {
        if(window.confirm('Delete station?')) {
            await api.delete('/api/admin/stations/' + id + '/');
            fetchStations();
        }
    };

    return (
        <div className="fade-in">
            <h1 className="page-title">Police Station Directory</h1>
            
            <div className="chart-card" style={{marginBottom: '2rem'}}>
                <h3>Add New Station</h3>
                <form className="admin-form-group" style={{flexDirection: 'row', flexWrap: 'wrap'}} onSubmit={handleAdd}>
                    <input className="admin-input" style={{flex: '1 1 200px'}} type="text" placeholder="Station Name" value={formData.station_name} onChange={e=>setFormData({...formData, station_name: e.target.value})} required/>
                    <input className="admin-input" style={{flex: '1 1 200px'}} type="text" placeholder="Station Code" value={formData.station_code} onChange={e=>setFormData({...formData, station_code: e.target.value})} required/>
                    <input className="admin-input" style={{flex: '1 1 200px'}} type="text" placeholder="District" value={formData.police_district} onChange={e=>setFormData({...formData, police_district: e.target.value})} required/>
                    <input className="admin-input" style={{flex: '1 1 200px'}} type="text" placeholder="Username" value={formData.username} onChange={e=>setFormData({...formData, username: e.target.value})} required/>
                    <button className="admin-btn" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}} type="submit"><FiPlus/> Add</button>
                </form>
            </div>

            {selectedStation && (
                <div className="chart-card" style={{marginBottom: '2rem', borderLeft: '4px solid #3b82f6'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                        <h3 style={{margin: 0}}>{selectedStation.station_name} Profile</h3>
                        <button onClick={() => setSelectedStation(null)} className="admin-btn" style={{background: '#f1f5f9', color: '#64748b', padding: '0.5rem'}}><FiX/></button>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                        <p><strong>Code:</strong> {selectedStation.station_code}</p>
                        <p><strong>Type:</strong> {selectedStation.station_type}</p>
                        <p><strong>Location:</strong> {selectedStation.location_name || 'N/A'}</p>
                        <p><strong>Police District:</strong> {selectedStation.police_district}</p>
                        <p><strong>Revenue District:</strong> {selectedStation.revenue_district}</p>
                        <p><strong>State:</strong> {selectedStation.state} / {selectedStation.country}</p>
                        <p><strong>Phone:</strong> {selectedStation.phone || 'N/A'}</p>
                        <p><strong>Email:</strong> {selectedStation.email || 'N/A'}</p>
                        <p><strong>Username:</strong> {selectedStation.username}</p>
                        <p><strong>Auth Key:</strong> {selectedStation.identification_key}</p>
                        <p><strong>Status:</strong> <span className={selectedStation.is_active ? "status-pill resolved" : "status-pill danger"}>{selectedStation.is_active ? 'Active' : 'Inactive'}</span></p>
                    </div>
                </div>
            )}

            <div className="recent-activity-card">
                <div className="table-responsive">
                    <table className="admin-modern-table">
                        <thead><tr><th>Name</th><th>Code</th><th>District</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {stations.map(s => (
                                <tr key={s.id}>
                                    <td className="fw-bold">{s.station_name}</td>
                                    <td>{s.station_code}</td>
                                    <td>{s.police_district}</td>
                                    <td><span className={s.is_active ? "status-pill resolved" : "status-pill danger"}>{s.is_active ? 'Active' : 'Inactive'}</span></td>
                                    <td style={{display: 'flex', gap: '0.5rem'}}>
                                        <button onClick={() => setSelectedStation(s)} className="admin-btn" style={{padding: '0.5rem', display: 'flex', alignItems: 'center'}}><FiEye/></button>
                                        <button onClick={() => handleDelete(s.id)} className="admin-btn danger" style={{padding: '0.5rem', display: 'flex', alignItems: 'center'}}><FiTrash2/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}'''

# 5. Refactor Stats
files['frontend/src/pages/admin/AdminStationStats.js'] = '''import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminStationStats() {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        api.get('/api/admin/stations/stats/').then(res => setStats(res.data.stats));
    }, []);

    return (
        <div className="fade-in">
            <h1 className="page-title">Station Performance Analytics</h1>
            
            <div className="chart-card" style={{marginBottom: '2rem'}}>
                <h3>Cases Resolved vs Pending per Station</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={stats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="station_name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="solved" stackId="a" fill="#10b981" name="Solved Cases" />
                        <Bar dataKey="unsolved" stackId="a" fill="#f59e0b" name="Unsolved Cases" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="recent-activity-card">
                <table className="admin-modern-table">
                    <thead><tr><th>Station</th><th>Total Cases</th><th>Solved</th><th>Unsolved</th><th>Clearance Rate</th></tr></thead>
                    <tbody>
                        {stats.map(s => {
                            const rate = s.total_cases > 0 ? Math.round((s.solved / s.total_cases) * 100) : 0;
                            return (
                                <tr key={s.station_id}>
                                    <td className="fw-bold">{s.station_name}</td>
                                    <td>{s.total_cases}</td>
                                    <td style={{color: '#10b981'}}>{s.solved}</td>
                                    <td style={{color: '#f59e0b'}}>{s.unsolved}</td>
                                    <td>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                            <div style={{width: '100px', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden'}}>
                                                <div style={{width: \%, height: '100%', background: '#3b82f6'}}></div>
                                            </div>
                                            <span style={{fontSize: '0.85rem'}}>{rate}%</span>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}'''

# 6. Refactor Broadcast
files['frontend/src/pages/admin/AdminBroadcast.js'] = '''import React, { useState } from 'react';
import api from '../../api/api';
import { FiRadio } from 'react-icons/fi';

export default function AdminBroadcast() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const handleBroadcast = async (e) => {
        e.preventDefault();
        await api.post('/api/admin/broadcast/', { title, message });
        alert('Broadcast sent!');
        setTitle(''); setMessage('');
    };

    return (
        <div className="fade-in">
            <h1 className="page-title">Broadcast Center</h1>
            <div className="chart-card" style={{maxWidth: '600px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
                    <div className="card-icon" style={{background: '#fee2e2', color: '#ef4444', width: '48px', height: '48px'}}><FiRadio/></div>
                    <div>
                        <h3 style={{margin: 0}}>Global Station Alert</h3>
                        <p className="text-muted" style={{margin: '0.25rem 0 0 0'}}>Send a high-priority notification to all active police stations instantly.</p>
                    </div>
                </div>
                
                <form className="admin-form-group" onSubmit={handleBroadcast}>
                    <input className="admin-input" type="text" placeholder="Alert Headline (e.g. URGENT: New Phishing Campaign)" value={title} onChange={e=>setTitle(e.target.value)} required/>
                    <textarea className="admin-input" style={{height: '150px', resize: 'vertical'}} placeholder="Detailed message and instructions for law enforcement officers..." value={message} onChange={e=>setMessage(e.target.value)} required></textarea>
                    <button className="admin-btn danger" type="submit" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'}}><FiRadio/> Broadcast to All Stations</button>
                </form>
            </div>
        </div>
    );
}'''

for path, content in files.items():
    with open(path, 'w') as f:
        f.write(content)

print('Redesign complete!')
