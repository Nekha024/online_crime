import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import '../css/Login.css'; // Reusing the common auth styles
import { FaShieldAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaIdCard, FaPhone } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({ 
        full_name: '', 
        phone_number: '', 
        email: '', 
        password: '', 
        confirm_password: '' 
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const res = await api.post('http://localhost:8000/accounts/register/', {
                full_name: formData.full_name,
                phone_number: formData.phone_number,
                email: formData.email,
                password: formData.password,
                confirm_password: formData.confirm_password
            }, {
                withCredentials: true
            });
            if (res.data.success) {
                // Navigate to login so they can verify phone
                navigate('/login', { state: { message: 'Registration successful! Please login with your phone number.' } });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-background-glow"></div>
            
            <Link to="/" className="auth-back-link">
                <FaArrowLeft /> Back to Home
            </Link>

            <div className="auth-card">
                <div className="auth-card-header" style={{ marginBottom: '20px' }}>
                    <FaShieldAlt className="auth-logo-icon" style={{ fontSize: '2rem', marginBottom: '10px' }} />
                    <h2>Create Account</h2>
                    <p>Join CrimeAI Citizen Portal</p>
                </div>

                {error && <div className="auth-error-message">{error}</div>}

                <form onSubmit={handleRegister} className="auth-form" style={{ gap: '15px' }}>
                    <div className="auth-input-group">
                        <label htmlFor="full_name">Full Name</label>
                        <div className="auth-input-wrapper">
                            <FaIdCard className="auth-input-icon" />
                            <input
                                id="full_name"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.full_name}
                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="phone_number">Phone Number</label>
                        <div className="auth-input-wrapper">
                            <FaPhone className="auth-input-icon" />
                            <input
                                id="phone_number"
                                type="tel"
                                placeholder="e.g. +1234567890"
                                value={formData.phone_number}
                                onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="auth-input-wrapper">
                            <FaEnvelope className="auth-input-icon" />
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="password">Password</label>
                        <div className="auth-input-wrapper">
                            <FaLock className="auth-input-icon" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <button 
                                type="button" 
                                className="auth-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="confirm_password">Confirm Password</label>
                        <div className="auth-input-wrapper">
                            <FaLock className="auth-input-icon" />
                            <input
                                id="confirm_password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={formData.confirm_password}
                                onChange={e => setFormData({ ...formData, confirm_password: e.target.value })}
                                required
                            />
                            <button 
                                type="button" 
                                className="auth-password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className={`auth-submit-btn ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Register Securely'}
                    </button>
                </form>

                <div className="auth-card-footer" style={{ marginTop: '15px', paddingTop: '15px' }}>
                    <p>
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

