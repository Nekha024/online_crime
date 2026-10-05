import React, { useEffect, useState } from 'react';
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
                                {pieData.map((entry, index) => <Cell key={'cell-' + index} fill={entry.color} />)}
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
}