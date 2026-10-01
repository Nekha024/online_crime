import os

queries_code = '''import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { FiMessageSquare, FiSend, FiCheckCircle } from 'react-icons/fi';

export default function AdminQueries() {
    const [queries, setQueries] = useState([]);
    const [replyText, setReplyText] = useState({});

    const fetchQueries = async () => {
        const res = await api.get('/api/admin/queries/');
        setQueries(res.data.queries);
    };

    useEffect(() => { fetchQueries(); }, []);

    const handleReply = async (id) => {
        if(!replyText[id]) return;
        await api.put('/api/admin/queries/', { query_id: id, reply: replyText[id] });
        alert('Reply sent successfully');
        fetchQueries();
    };

    return (
        <div className="fade-in">
            <h1 className="page-title">Helpdesk & Queries</h1>
            
            {queries.length === 0 ? (
                <div className="chart-card" style={{textAlign: 'center', padding: '3rem'}}>
                    <FiCheckCircle style={{fontSize: '3rem', color: '#10b981', marginBottom: '1rem'}} />
                    <h3>Inbox Zero</h3>
                    <p className="text-muted">No pending queries from police stations.</p>
                </div>
            ) : (
                <div style={{display: 'grid', gap: '1.5rem'}}>
                    {queries.map(q => (
                        <div key={q.id} className="chart-card" style={{borderLeft: q.status === 'Pending' ? '4px solid #f59e0b' : '4px solid #10b981'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                                <div>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem'}}>
                                        <h3 style={{margin: 0}}>{q.station}</h3>
                                        <span className={q.status === 'Pending' ? "status-pill pending" : "status-pill resolved"}>{q.status}</span>
                                    </div>
                                    <h4 style={{margin: '0 0 0.5rem 0', color: '#1e293b'}}>{q.subject}</h4>
                                    <p className="text-muted" style={{margin: 0, fontSize: '0.95rem'}}>{q.message}</p>
                                </div>
                                <span className="text-muted" style={{fontSize: '0.85rem'}}>{new Date(q.created_at).toLocaleDateString()}</span>
                            </div>
                            
                            {q.status === 'Pending' ? (
                                <div style={{marginTop: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                                    <textarea 
                                        className="admin-input" 
                                        style={{marginBottom: '1rem', minHeight: '80px', resize: 'vertical'}} 
                                        placeholder="Type your official response..." 
                                        onChange={e=>setReplyText({...replyText, [q.id]: e.target.value})}
                                    ></textarea>
                                    <button onClick={()=>handleReply(q.id)} className="admin-btn" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                        <FiSend/> Send Reply
                                    </button>
                                </div>
                            ) : (
                                <div style={{marginTop: '1.5rem', background: '#eff6ff', padding: '1rem', borderRadius: '8px', border: '1px solid #bfdbfe'}}>
                                    <h5 style={{margin: '0 0 0.5rem 0', color: '#1e40af'}}>Your Official Reply:</h5>
                                    <p style={{margin: 0, color: '#1e3a8a', fontSize: '0.95rem'}}>{q.admin_reply}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}'''

with open('frontend/src/pages/admin/AdminQueries.js', 'w') as f:
    f.write(queries_code)

print("Queries page updated")
