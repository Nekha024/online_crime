import os

login_code = '''import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { FiShield, FiLock, FiMail, FiArrowRight } from 'react-icons/fi';
import './Admin.css';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await api.post('/api/admin/login/', { email, password });
            if (res.data.success) {
                localStorage.setItem('adminAuth', 'true');
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please verify your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-wrapper">
            <div className="admin-login-card fade-in">
                <div className="admin-login-header">
                    <div className="login-icon-container">
                        <FiShield className="login-shield-icon" />
                    </div>
                    <h2>Secure Admin Portal</h2>
                    <p>Authorized Personnel Only</p>
                </div>
                
                {error && <div className="admin-login-error"><FiLock /> {error}</div>}
                
                <form onSubmit={handleLogin} className="admin-login-form">
                    <div className="input-group">
                        <FiMail className="input-icon" />
                        <input 
                            type="email" 
                            placeholder="Official Email Address" 
                            value={email} 
                            onChange={e=>setEmail(e.target.value)} 
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <FiLock className="input-icon" />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={e=>setPassword(e.target.value)} 
                            required
                        />
                    </div>
                    
                    <button type="submit" className="admin-login-btn" disabled={isLoading}>
                        {isLoading ? 'Authenticating...' : (
                            <>Sign In to Command Center <FiArrowRight /></>
                        )}
                    </button>
                </form>
                
                <div className="admin-login-footer">
                    CrimeAI Advanced Threat Intelligence System
                </div>
            </div>
        </div>
    );
}'''

with open('frontend/src/pages/admin/AdminLogin.js', 'w') as f:
    f.write(login_code)

css_append = '''
/* High-Security Admin Login */
.admin-login-wrapper { display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); font-family: 'Inter', sans-serif; }
.admin-login-card { background: #ffffff; padding: 2.5rem 2rem; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3), 0 10px 10px -5px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
.admin-login-header { text-align: center; margin-bottom: 2rem; }
.login-icon-container { width: 64px; height: 64px; background: #eff6ff; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 1rem; }
.login-shield-icon { font-size: 2rem; color: #3b82f6; }
.admin-login-header h2 { margin: 0 0 0.5rem 0; color: #0f172a; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px; }
.admin-login-header p { margin: 0; color: #64748b; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }

.admin-login-error { background: #fef2f2; color: #dc2626; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.85rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; border: 1px solid #f87171; }

.admin-login-form { display: flex; flex-direction: column; gap: 1.25rem; }
.input-group { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 1rem; color: #94a3b8; font-size: 1.1rem; }
.input-group input { width: 100%; padding: 0.85rem 1rem 0.85rem 2.75rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; outline: none; transition: all 0.2s; box-sizing: border-box; }
.input-group input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }

.admin-login-btn { background: #3b82f6; color: white; border: none; padding: 0.85rem; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: background 0.2s; display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }
.admin-login-btn:hover { background: #2563eb; }
.admin-login-btn:disabled { background: #94a3b8; cursor: not-allowed; }

.admin-login-footer { margin-top: 2rem; text-align: center; color: #94a3b8; font-size: 0.75rem; letter-spacing: 0.5px; }
'''

with open('frontend/src/pages/admin/Admin.css', 'a') as f:
    f.write(css_append)

print("AdminLogin redesigned")
