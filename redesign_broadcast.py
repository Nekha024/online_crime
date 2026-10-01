import os

broadcast_code = '''import React, { useState } from 'react';
import api from '../../api/api';
import { FiRadio, FiAlertTriangle, FiInfo, FiCheckCircle, FiSend } from 'react-icons/fi';
import './Admin.css';

export default function AdminBroadcast() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState('INFO');
    const [statusMsg, setStatusMsg] = useState(null);
    const [isSending, setIsSending] = useState(false);

    const handleBroadcast = async (e) => {
        e.preventDefault();
        setIsSending(true);
        try {
            const finalTitle = [\] \;
            await api.post('/api/admin/broadcast/', { title: finalTitle, message });
            setStatusMsg({ type: 'success', text: 'Broadcast transmission successful. All stations notified.' });
            setTitle(''); 
            setMessage('');
            setTimeout(() => setStatusMsg(null), 5000);
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'Failed to send broadcast. Please try again.' });
        } finally {
            setIsSending(false);
        }
    };

    const getPriorityColor = () => {
        if(priority === 'CRITICAL') return '#ef4444';
        if(priority === 'WARNING') return '#f59e0b';
        return '#3b82f6';
    };
    
    const getPriorityIcon = () => {
        if(priority === 'CRITICAL') return <FiAlertTriangle />;
        if(priority === 'WARNING') return <FiAlertTriangle />;
        return <FiInfo />;
    };

    return (
        <div className="fade-in">
            <h1 className="page-title">Emergency Broadcast System</h1>
            
            {statusMsg && (
                <div className={roadcast-status \}>
                    {statusMsg.type === 'success' ? <FiCheckCircle /> : <FiAlertTriangle />} 
                    {statusMsg.text}
                </div>
            )}

            <div className="broadcast-grid">
                {/* Left Column: Form */}
                <div className="chart-card">
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
                        <div className="card-icon" style={{background: '#eff6ff', color: '#3b82f6', width: '48px', height: '48px'}}>
                            <FiRadio/>
                        </div>
                        <div>
                            <h3 style={{margin: 0}}>Compose Alert</h3>
                            <p className="text-muted" style={{margin: '0.25rem 0 0 0'}}>Send immediate push notifications to all active command centers.</p>
                        </div>
                    </div>
                    
                    <form className="admin-form-group" onSubmit={handleBroadcast}>
                        <div className="input-block">
                            <label>Alert Priority Level</label>
                            <select className="admin-input" value={priority} onChange={e=>setPriority(e.target.value)}>
                                <option value="INFO">Information / Update</option>
                                <option value="WARNING">Warning / Be on Lookout</option>
                                <option value="CRITICAL">CRITICAL EMERGENCY</option>
                            </select>
                        </div>

                        <div className="input-block">
                            <label>Headline</label>
                            <input 
                                className="admin-input" 
                                type="text" 
                                placeholder="e.g. New Phishing Campaign Targeting Seniors" 
                                value={title} 
                                onChange={e=>setTitle(e.target.value)} 
                                required
                            />
                        </div>
                        
                        <div className="input-block">
                            <label>Detailed Briefing</label>
                            <textarea 
                                className="admin-input" 
                                style={{height: '180px', resize: 'vertical'}} 
                                placeholder="Provide exact instructions and context for law enforcement officers..." 
                                value={message} 
                                onChange={e=>setMessage(e.target.value)} 
                                required
                            ></textarea>
                        </div>
                        
                        <button 
                            className={dmin-btn \} 
                            type="submit" 
                            disabled={isSending}
                            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '1rem', fontSize: '1.05rem'}}
                        >
                            {isSending ? 'Transmitting...' : <><FiSend/> Broadcast to All Stations</>}
                        </button>
                    </form>
                </div>

                {/* Right Column: Live Preview */}
                <div className="chart-card preview-card">
                    <h3 style={{borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem'}}>Live Notification Preview</h3>
                    <p className="text-muted" style={{marginBottom: '2rem'}}>This is how the alert will appear on the Police Officer Dashboard:</p>
                    
                    <div className="notification-preview-box">
                        <div className="preview-header" style={{background: getPriorityColor()}}>
                            {getPriorityIcon()}
                            <span>{priority} ALERT</span>
                        </div>
                        <div className="preview-body">
                            <h4>{title || 'Alert Headline Will Appear Here'}</h4>
                            <p>{message || 'The detailed briefing and instructions will be displayed in this section. Type in the form to see a live preview.'}</p>
                            <div className="preview-footer">
                                <span>Sent from SYSTEM ADMIN</span>
                                <span>Just now</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}'''

with open('frontend/src/pages/admin/AdminBroadcast.js', 'w') as f:
    f.write(broadcast_code)

css_append = '''
/* Broadcast Redesign */
.broadcast-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem; align-items: start; }
@media (max-width: 900px) { .broadcast-grid { grid-template-columns: 1fr; } }

.broadcast-status { padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem; font-weight: 600; animation: slideDown 0.3s ease-out; }
.broadcast-status.success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
.broadcast-status.error { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }

.input-block label { display: block; margin-bottom: 0.5rem; color: var(--admin-text-main); font-weight: 600; font-size: 0.9rem; }
.admin-input:focus { outline: none; border-color: var(--admin-primary); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }

.preview-card { background: #f8fafc; border: 1px dashed #cbd5e1; box-shadow: none; }
.notification-preview-box { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); transition: all 0.3s; }
.preview-header { color: white; padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.5rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; transition: background 0.3s; }
.preview-body { padding: 1.5rem; }
.preview-body h4 { margin: 0 0 0.75rem 0; color: #1e293b; font-size: 1.1rem; line-height: 1.4; word-wrap: break-word; }
.preview-body p { margin: 0 0 1.5rem 0; color: #475569; font-size: 0.95rem; line-height: 1.5; white-space: pre-wrap; word-wrap: break-word; }
.preview-footer { display: flex; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 1rem; color: #94a3b8; font-size: 0.8rem; font-weight: 500; }

@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
'''

with open('frontend/src/pages/admin/Admin.css', 'a') as f:
    f.write(css_append)

print("AdminBroadcast redesigned")
