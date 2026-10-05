import React, { useEffect, useState } from 'react';
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
                                                <div style={{width: rate + '%', height: '100%', background: '#3b82f6'}}></div>
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
}