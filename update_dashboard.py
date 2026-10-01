import os

dashboard_code = '''import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import './Admin.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/api/admin/dashboard-stats/')
           .then(res => setStats(res.data.stats))
           .catch(err => console.error(err));
    }, []);

    if (!stats) return <div>Loading dashboard...</div>;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome to the System Admin control center. Here is the real-time system overview.</p>
            
            <div className="dashboard-cards">
                <div className="dash-card">
                    <h3>Total Cases</h3>
                    <div className="stat-number">{stats.total_cases}</div>
                </div>
                <div className="dash-card success">
                    <h3>Total Solved</h3>
                    <div className="stat-number">{stats.total_solved}</div>
                </div>
                <div className="dash-card warning">
                    <h3>Total Pending</h3>
                    <div className="stat-number">{stats.total_pending}</div>
                </div>
                <div className="dash-card danger">
                    <h3>High/Critical Priority</h3>
                    <div className="stat-number">{stats.high_critical_cases}</div>
                </div>
            </div>

            <div className="recent-activity">
                <h2>Recent Crimes Reported</h2>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Case ID</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.recent_cases.map(c => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.title}</td>
                                <td><span className={"status-badge " + c.status.toLowerCase().replace(' ', '-')}>{c.status}</span></td>
                                <td>{c.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
'''

css_append = '''
.dashboard-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-top: 2rem; margin-bottom: 3rem;}
.dash-card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center; border-top: 4px solid #002147; }
.dash-card h3 { margin: 0 0 1rem 0; color: #555; font-size: 1.1rem; }
.stat-number { font-size: 2.5rem; font-weight: bold; color: #333; }
.dash-card.success { border-top-color: #28a745; }
.dash-card.success .stat-number { color: #28a745; }
.dash-card.warning { border-top-color: #ffc107; }
.dash-card.warning .stat-number { color: #d39e00; }
.dash-card.danger { border-top-color: #dc3545; }
.dash-card.danger .stat-number { color: #dc3545; }

.status-badge { padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.85rem; font-weight: bold; }
.status-badge.resolved, .status-badge.closed { background: #d4edda; color: #155724; }
.status-badge.submitted, .status-badge.pending { background: #fff3cd; color: #856404; }
.status-badge.under-investigation { background: #cce5ff; color: #004085; }
'''

with open('frontend/src/pages/admin/AdminDashboard.js', 'w') as f:
    f.write(dashboard_code)

with open('frontend/src/pages/admin/Admin.css', 'a') as f:
    f.write(css_append)

print("Dashboard updated.")
