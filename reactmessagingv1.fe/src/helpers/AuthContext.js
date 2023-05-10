import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false); // Set loading to false by default
    const navigate = useNavigate();

    const storedToken = localStorage.getItem('token');

    const login = () => {
        //does nothing
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    const value = {
        currentUser,
        setCurrentUser,
        token: storedToken,
        login,
        logout,
    };

    if (loading) {
        return <div>Loading...</div>; // Or replace this with a loading spinner or similar
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

