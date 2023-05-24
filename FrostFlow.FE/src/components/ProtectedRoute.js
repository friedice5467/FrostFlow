import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../helpers/AuthContext';

function ProtectedRoute({ children }) {
    const { token } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    return token ? children : null;
}

export default ProtectedRoute;
