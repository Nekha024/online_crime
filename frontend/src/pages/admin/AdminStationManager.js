import React, { useEffect, useState } from 'react';
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
}