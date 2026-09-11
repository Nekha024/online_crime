import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
    const [infoMessage, setInfoMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.phone_number) {
            setFormData(prev => ({
                ...prev,
                phone_number: location.state.phone_number
            }));
        }
        if (location.state?.message) {
            setInfoMessage(location.state.message);
        }
    }, [location.state]);

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
                // Navigate to login so they can verify phone, prefilling their registered phone
                navigate('/login', { 
                    state: { 
                        phone_number: formData.phone_number,
                        message: 'Registration successful! Please login with your phone number.' 
                    } 
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card-wrapper register-card-wrapper">
                <Link to="/" className="auth-back-link">
                    <FaArrowLeft /> Back to Home
                </Link>

                <div className="auth-card">
                    <div className="auth-card-header">
                        <div className="auth-icon-circle">
                            <FaShieldAlt />
                        </div>
                        <h2 className="auth-title">Create Citizen Account</h2>
                        <p className="auth-subtitle">Register to submit reports and track your case status</p>
                    </div>

                    {infoMessage && <div className="auth-alert-info">{infoMessage}</div>}
                    {error && <div className="auth-alert-error">{error}</div>}

                    <form onSubmit={handleRegister} className="auth-form">
                        <div className="auth-input-group">
                            <label htmlFor="full_name">Full Name</label>
                            <div className="auth-input-wrapper">
                                <FaIdCard className="auth-input-icon" />
                                <input
                                    id="full_name"
                                    className="auth-input"
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
                                    className="auth-input"
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
                                    className="auth-input"
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
                                    className="auth-input has-toggle"
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
                                    aria-label={showPassword ? "Hide password" : "Show password"}
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
                                    className="auth-input has-toggle"
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
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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

                    <div className="auth-card-footer">
                        <p>
                            Already have an account? <Link to="/login">Login here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

