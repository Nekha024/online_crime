import os

files = {
    'frontend/src/pages/admin/AdminStationManager.js': '''import React, { useEffect, useState } from 'react';
import api from '../../api/api';

export default function AdminStationManager() {
    const [stations, setStations] = useState([]);
    const [formData, setFormData] = useState({ station_name: '', station_code: '', police_district: '', username: '' });

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
            <form className="admin-form" onSubmit={handleAdd}>
                <input type="text" placeholder="Station Name" value={formData.station_name} onChange={e=>setFormData({...formData, station_name: e.target.value})} required/>
                <input type="text" placeholder="Station Code" value={formData.station_code} onChange={e=>setFormData({...formData, station_code: e.target.value})} required/>
                <input type="text" placeholder="District" value={formData.police_district} onChange={e=>setFormData({...formData, police_district: e.target.value})} required/>
                <input type="text" placeholder="Username" value={formData.username} onChange={e=>setFormData({...formData, username: e.target.value})} required/>
                <button type="submit">Add Station</button>
            </form>
            <table className="admin-table">
                <thead><tr><th>Name</th><th>Code</th><th>District</th><th>Username</th><th>Action</th></tr></thead>
                <tbody>
                    {stations.map(s => (
                        <tr key={s.id}>
                            <td>{s.station_name}</td><td>{s.station_code}</td><td>{s.police_district}</td><td>{s.username}</td>
                            <td><button onClick={() => handleDelete(s.id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}''',
    'frontend/src/pages/admin/AdminStationStats.js': '''import React, { useEffect, useState } from 'react';
import api from '../../api/api';

export default function AdminStationStats() {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        api.get('/api/admin/stations/stats/').then(res => setStats(res.data.stats));
    }, []);

    return (
        <div>
            <h2>Station Statistics</h2>
            <table className="admin-table">
                <thead><tr><th>Station</th><th>Total Cases</th><th>Solved</th><th>Unsolved</th></tr></thead>
                <tbody>
                    {stats.map(s => (
                        <tr key={s.station_id}>
                            <td>{s.station_name}</td><td>{s.total_cases}</td><td>{s.solved}</td><td>{s.unsolved}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}''',
    'frontend/src/pages/admin/AdminBroadcast.js': '''import React, { useState } from 'react';
import api from '../../api/api';

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
        <div>
            <h2>Broadcast Alert</h2>
            <form className="admin-form" onSubmit={handleBroadcast}>
                <input type="text" placeholder="Alert Title" value={title} onChange={e=>setTitle(e.target.value)} required/>
                <textarea placeholder="Message body..." value={message} onChange={e=>setMessage(e.target.value)} required></textarea>
                <button type="submit">Send to All Stations</button>
            </form>
        </div>
    );
}''',
    'frontend/src/pages/admin/AdminQueries.js': '''import React, { useEffect, useState } from 'react';
import api from '../../api/api';

export default function AdminQueries() {
    const [queries, setQueries] = useState([]);
    const [replyText, setReplyText] = useState({});

    const fetchQueries = async () => {
        const res = await api.get('/api/admin/queries/');
        setQueries(res.data.queries);
    };

    useEffect(() => { fetchQueries(); }, []);

    const handleReply = async (id) => {
        await api.put('/api/admin/queries/', { query_id: id, reply: replyText[id] });
        alert('Reply sent');
        fetchQueries();
    };

    return (
        <div>
            <h2>Station Queries</h2>
            {queries.length === 0 ? <p>No queries found.</p> : queries.map(q => (
                <div key={q.id} style={{border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem'}}>
                    <h3>{q.station} - {q.subject}</h3>
                    <p>{q.message}</p>
                    <p><strong>Status:</strong> {q.status}</p>
                    {q.status === 'Pending' ? (
                        <div style={{marginTop: '1rem'}}>
                            <textarea placeholder="Your reply..." onChange={e=>setReplyText({...replyText, [q.id]: e.target.value})} style={{width: '100%', marginBottom: '10px'}}></textarea>
                            <button onClick={()=>handleReply(q.id)} style={{padding: '0.5rem', background: '#002147', color: 'white'}}>Send Reply</button>
                        </div>
                    ) : (
                        <p><strong>Your Reply:</strong> {q.admin_reply}</p>
                    )}
                </div>
            ))}
        </div>
    );
}'''
}

for path, content in files.items():
    with open(path, 'w') as f:
        f.write(content)
print('Files 2 created.')
