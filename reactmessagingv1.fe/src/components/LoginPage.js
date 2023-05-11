import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../helpers/AuthContext';
import api from '../helpers/api';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { setCurrentUser } = useAuth();
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('identity/login', {
                Email: email,
                Password: password
            });

            const data = response.data;
            localStorage.setItem('token', data.token);
            const decodedToken = parseJwt(data.token);
            setCurrentUser({ email: decodedToken.sub }); // JWT standard claim for subject, which you've used for email
            navigate('/dashboard');
        } catch (err) {
            // If we get here, the request failed
            setError('Invalid email or password');
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="login-title">Log In</h1>

                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : 'Log In'}
                    </button>
                </form>

                <div className="signup-container">
                    <p>
                        Don't have an account? <a href="/register">Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
