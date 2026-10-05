import React, { useState } from 'react';
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
}