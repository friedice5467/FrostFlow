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
    let initialUser = null;

    if (storedToken) {
        const decodedToken = parseJwt(storedToken);
        initialUser = { email: decodedToken.sub };
    }

    const [currentUser, setCurrentUser] = useState(initialUser);

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

export function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}


