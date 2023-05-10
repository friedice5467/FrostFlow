import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../helpers/api';
import './RegisterPage.css';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const getPasswordStrength = () => {
        // This is a very simple password strength check
        // You may want to add more complex checks or use a library
        return password.length > 8 ? 'Strong' : 'Weak';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('identity/register', {
                Email: email,
                Password: password,
                ConfirmPassword: confirmPassword,
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                setError('Registration failed');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-box">
                    <h1 className="register-title">Register</h1>
                    <form onSubmit={handleSubmit}>
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
                        <div className="password-strength">
                            Password strength: {getPasswordStrength()}
                        </div>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success">Register Success!</p>}
                        <button type="submit" disabled={loading}>
                            {loading ? 'Loading...' : 'Register'}
                        </button>
                    </form>
                    <p>
                        Already have an account? <a href="/login">Log In</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
