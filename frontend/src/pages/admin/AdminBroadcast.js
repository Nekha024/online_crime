import React, { useState } from 'react';
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
            const finalTitle = "[" + priority + "] " + title;
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
                <div className={'broadcast-status ' + statusMsg.type}>
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
                            className={'admin-btn ' + (priority === 'CRITICAL' ? 'danger' : 'primary')} 
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
}
