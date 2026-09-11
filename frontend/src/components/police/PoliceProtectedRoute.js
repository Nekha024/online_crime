import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PoliceProtectedRoute = ({ children }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyPoliceAuth = async () => {
            const token = sessionStorage.getItem('police_token');
            if (!token) {
                setIsAuthenticated(false);
                setIsChecking(false);
                return;
            }

            try {
                const res = await axios.get('http://localhost:8000/api/police/me/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });

                if (res.data?.success && res.data?.station) {
                    setIsAuthenticated(true);
                    sessionStorage.setItem('police_station', JSON.stringify(res.data.station));
                } else {
                    setIsAuthenticated(false);
                    sessionStorage.removeItem('police_token');
                    sessionStorage.removeItem('police_station');
                }
            } catch (err) {
                setIsAuthenticated(false);
                sessionStorage.removeItem('police_token');
                sessionStorage.removeItem('police_station');
            } finally {
                setIsChecking(false);
            }
        };

        verifyPoliceAuth();
    }, []);

    if (isChecking) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f1f5f9',
                color: '#1e3a8a',
                fontFamily: 'sans-serif'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>🔒</div>
                    <div style={{ fontWeight: 600 }}>Verifying Police Station Authorization...</div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/police/login/" replace />;
    }

    return children;
};

export default PoliceProtectedRoute;
