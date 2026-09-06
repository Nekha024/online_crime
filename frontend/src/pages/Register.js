import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('http://localhost:8000/accounts/register/', formData, {
                withCredentials: true
            });
            if (res.data.success) {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' }}>
            <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '8px', color: 'white', width: '350px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#38bdf8' }}>Register for CrimeAI</h2>
                {error && <p style={{ color: '#f87171', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                        required
                        style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                        style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        required
                        style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                    <button type="submit" style={{ padding: '0.8rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '0.5rem' }}>
                        Register
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
                    Already have an account? <Link to="/login" style={{ color: '#38bdf8', textDecoration: 'none' }}>Login</Link>
                </p>
                <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>&larr; Back to Home</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

