import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const storedToken = localStorage.getItem('token');
    const initialCurrentUser = storedToken ? jwtDecode(storedToken) : null;
    const { sub: userId, name: email } = initialCurrentUser;
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({ userId, email });

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const value = {
        currentUser,
        setCurrentUser,
        token: storedToken,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


