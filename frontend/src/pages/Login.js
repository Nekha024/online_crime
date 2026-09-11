import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api/api';
import { useCrime } from '../context/CrimeContext';
import '../css/Login.css';
import { FaShieldAlt, FaPhone, FaKey, FaArrowLeft, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' or 'password'
    const [step, setStep] = useState(1);
    
    // OTP Fields
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    
    // Password Fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const { setUserProfile } = useCrime();

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
        }
        if (location.state?.phone_number) {
            setPhoneNumber(location.state.phone_number);
        }
    }, [location.state]);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);
        try {
            const res = await api.post('http://localhost:8000/accounts/send-otp/', {
                phone_number: phoneNumber.trim()
            });
            if (res.data.success) {
                setSuccessMessage('OTP has been sent to your phone number.');
                setStep(2);
            }
        } catch (err) {
            if (
                err.response?.status === 404 ||
                err.response?.data?.not_registered ||
                err.response?.data?.message?.toLowerCase().includes('not found') ||
                err.response?.data?.message?.toLowerCase().includes('not registered')
            ) {
                // Phone number is not registered -> automatically navigate to register / create account
                navigate('/register', {
                    state: {
                        phone_number: phoneNumber.trim(),
                        message: 'This phone number is not registered yet. Please create your account to proceed.'
                    }
                });
                return;
            }
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await api.post('http://localhost:8000/accounts/verify-otp/', {
                phone_number: phoneNumber,
                otp: otp
            }, {
                withCredentials: true
            });
            if (res.data.success) {
                if (res.data.user) {
                    setUserProfile(prev => ({
                        ...prev,
                        name: res.data.user.name || res.data.user.username,
                        email: res.data.user.email || '',
                        phone_number: res.data.user.phone_number || ''
                    }));
                }
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await api.post('http://localhost:8000/accounts/login/', {
                email: email,
                password: password
            }, {
                withCredentials: true
            });
            if (res.data.success) {
                if (res.data.user) {
                    setUserProfile(prev => ({
                        ...prev,
                        name: res.data.user.name || res.data.user.username,
                        email: res.data.user.email || '',
                        phone_number: res.data.user.phone_number || ''
                    }));
                }
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleLoginMethod = () => {
        setLoginMethod(prev => prev === 'otp' ? 'password' : 'otp');
        setError('');
        setSuccessMessage('');
        setStep(1);
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card-wrapper">
                <Link to="/" className="auth-back-link">
                    <FaArrowLeft /> Back to Home
                </Link>

                <div className="auth-card">
                    <div className="auth-card-header">
                        <div className="auth-icon-circle">
                            <FaShieldAlt />
                        </div>
                        <h2 className="auth-title">
                            {loginMethod === 'password' ? 'Citizen Login' : (step === 1 ? 'Citizen Login' : 'Verify Identity')}
                        </h2>
                        <p className="auth-subtitle">
                            {loginMethod === 'password' 
                                ? 'Access your reports and case tracking portal' 
                                : (step === 1 ? 'Log in securely with your registered phone number' : 'Enter the 6-digit verification code sent to your phone')}
                        </p>
                    </div>

                    {error && <div className="auth-alert-error">{error}</div>}
                    {successMessage && <div className="auth-alert-success">{successMessage}</div>}

                    {loginMethod === 'otp' ? (
                        step === 1 ? (
                            <form onSubmit={handleSendOTP} className="auth-form">
                                <div className="auth-input-group">
                                    <label htmlFor="phone_number">Phone Number</label>
                                    <div className="auth-input-wrapper">
                                        <FaPhone className="auth-input-icon" />
                                        <input
                                            id="phone_number"
                                            className="auth-input"
                                            type="tel"
                                            placeholder="Enter your phone number"
                                            value={phoneNumber}
                                            onChange={e => setPhoneNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className={`auth-submit-btn ${isLoading ? 'loading' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOTP} className="auth-form">
                                <div className="auth-input-group">
                                    <label htmlFor="otp">One Time Password (OTP)</label>
                                    <div className="auth-input-wrapper">
                                        <FaKey className="auth-input-icon" />
                                        <input
                                            id="otp"
                                            className="auth-input"
                                            type="text"
                                            maxLength="6"
                                            placeholder="Enter 6-digit OTP"
                                            value={otp}
                                            onChange={e => setOtp(e.target.value)}
                                            required
                                            style={{ letterSpacing: '3px', fontWeight: '600' }}
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className={`auth-submit-btn ${isLoading ? 'loading' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Verifying...' : 'Verify OTP / Login'}
                                </button>
                                
                                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                                    <button 
                                        type="button" 
                                        onClick={handleSendOTP} 
                                        className="auth-resend-btn"
                                        disabled={isLoading}
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            </form>
                        )
                    ) : (
                        <form onSubmit={handlePasswordLogin} className="auth-form">
                            <div className="auth-input-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="auth-input-wrapper">
                                    <FaEnvelope className="auth-input-icon" />
                                    <input
                                        id="email"
                                        className="auth-input"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
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
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
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

                            <button 
                                type="submit" 
                                className={`auth-submit-btn ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Authenticating...' : 'Login Securely'}
                            </button>
                        </form>
                    )}

                    <div className="auth-divider">
                        <hr className="auth-divider-line" />
                        <span className="auth-divider-text">OR</span>
                        <hr className="auth-divider-line" />
                    </div>

                    <button 
                        type="button" 
                        onClick={toggleLoginMethod}
                        className="auth-secondary-btn"
                    >
                        {loginMethod === 'otp' ? 'Login with Email & Password' : 'Login with Phone Number (OTP)'}
                    </button>

                    <div className="auth-card-footer">
                        <p>
                            Don't have an account? <Link to="/register">Register now</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

