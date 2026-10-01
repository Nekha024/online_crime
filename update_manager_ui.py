import os

manager_code = '''import React, { useEffect, useState } from 'react';
import api from '../../api/api';

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
        <div>
            <h2>Station Manager</h2>
            <form className="admin-form" onSubmit={handleAdd} style={{marginBottom: '2rem'}}>
                <input type="text" placeholder="Station Name" value={formData.station_name} onChange={e=>setFormData({...formData, station_name: e.target.value})} required/>
                <input type="text" placeholder="Station Code" value={formData.station_code} onChange={e=>setFormData({...formData, station_code: e.target.value})} required/>
                <input type="text" placeholder="District" value={formData.police_district} onChange={e=>setFormData({...formData, police_district: e.target.value})} required/>
                <input type="text" placeholder="Username" value={formData.username} onChange={e=>setFormData({...formData, username: e.target.value})} required/>
                <button type="submit">Add Station</button>
            </form>

            {selectedStation && (
                <div style={{background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
                    <h3>{selectedStation.station_name} Profile</h3>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
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
                        <p><strong>Status:</strong> {selectedStation.is_active ? 'Active' : 'Inactive'}</p>
                    </div>
                    <button onClick={() => setSelectedStation(null)} style={{background: '#555', color: 'white', border: 'none', padding: '0.5rem 1rem', marginTop: '1rem', cursor: 'pointer', borderRadius: '4px'}}>Close Profile</button>
                </div>
            )}

            <table className="admin-table">
                <thead><tr><th>Name</th><th>Code</th><th>District</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                    {stations.map(s => (
                        <tr key={s.id}>
                            <td>{s.station_name}</td>
                            <td>{s.station_code}</td>
                            <td>{s.police_district}</td>
                            <td>{s.is_active ? 'Active' : 'Inactive'}</td>
                            <td>
                                <button onClick={() => setSelectedStation(s)} style={{background: '#002147', color: 'white', padding: '0.3rem 0.6rem', border: 'none', cursor: 'pointer', borderRadius: '4px', marginRight: '0.5rem'}}>View Profile</button>
                                <button onClick={() => handleDelete(s.id)} style={{background: '#dc3545', color: 'white', padding: '0.3rem 0.6rem', border: 'none', cursor: 'pointer', borderRadius: '4px'}}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
'''

with open('frontend/src/pages/admin/AdminStationManager.js', 'w') as f:
    f.write(manager_code)

print("AdminStationManager updated")
