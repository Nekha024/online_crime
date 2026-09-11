import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShieldAlt, FaUserShield, FaKey, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import '../../css/PoliceAuth.css';

const PoliceLogin = () => {
    const [username, setUsername] = useState('');
    const [identificationKey, setIdentificationKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:8000/api/police/login/', {
                username: username.trim(),
                identification_key: identificationKey.trim()
            }, {
                withCredentials: true
            });

            if (res.data?.success) {
                // Store isolated police session data
                sessionStorage.setItem('police_token', res.data.token);
                sessionStorage.setItem('police_station', JSON.stringify(res.data.station));
                
                // Redirect strictly to police dashboard
                navigate('/police/dashboard/');
            } else {
                setError('Invalid police station credentials.');
            }
        } catch (err) {
            // Requirement 4: On failure show exact message and do not reveal what failed
            setError('Invalid police station credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="police-auth-root">
            <div className="police-bg-grid"></div>
            <div className="police-glow-circle"></div>

            <div className="police-auth-card">
                <div className="police-badge-header">
                    <div className="police-badge-icon-wrap">
                        <FaShieldAlt />
                    </div>
                    <h1>Police Station Portal</h1>
                    <p>Law Enforcement Authentication Service</p>
                    <span className="police-tag">Authorized Personnel Only</span>
                </div>

                {error && (
                    <div className="police-error-alert">
                        <FaLock />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="police-form">
                    <div className="police-field-group">
                        <label htmlFor="ps_username">Police Station Username</label>
                        <div className="police-input-wrap">
                            <FaUserShield className="police-input-icon" />
                            <input
                                id="ps_username"
                                type="text"
                                placeholder="e.g. alappuzha_cyber or station code"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                required
                            />
                        </div>
                    </div>

                    <div className="police-field-group">
                        <label htmlFor="ps_id_key">Unique Identification Key</label>
                        <div className="police-input-wrap">
                            <FaKey className="police-input-icon" />
                            <input
                                id="ps_id_key"
                                type={showKey ? 'text' : 'password'}
                                placeholder="Enter station identification key"
                                value={identificationKey}
                                onChange={(e) => setIdentificationKey(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="police-toggle-vis"
                                onClick={() => setShowKey(!showKey)}
                                aria-label={showKey ? "Hide identification key" : "Show identification key"}
                            >
                                {showKey ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="police-btn-submit"
                        disabled={isLoading}
                    >
                        <FaShieldAlt />
                        {isLoading ? 'Verifying Credentials...' : 'Authenticate Police Station'}
                    </button>
                </form>

                <div className="police-security-footer">
                    <span>Restricted official gateway. All access attempts are recorded and monitored in compliance with state security guidelines.</span>
                </div>
            </div>
        </div>
    );
};

export default PoliceLogin;
