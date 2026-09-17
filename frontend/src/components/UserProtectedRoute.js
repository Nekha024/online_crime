import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/api';

const UserProtectedRoute = ({ children }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyUserAuth = async () => {
            try {
                const res = await api.get('http://localhost:8000/accounts/me/', {
                    withCredentials: true
                });

                if (res.data?.success && res.data?.user) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (err) {
                setIsAuthenticated(false);
            } finally {
                setIsChecking(false);
            }
        };

        verifyUserAuth();
    }, []);

    if (isChecking) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8fafc',
                color: '#334155',
                fontFamily: 'sans-serif'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>🔒</div>
                    <div style={{ fontWeight: 600 }}>Verifying User Authorization...</div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default UserProtectedRoute;
