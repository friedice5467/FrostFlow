import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../helpers/AuthContext';
import api from '../helpers/api';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import jwtDecode from 'jwt-decode';

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
                Password: password,
            });

            const data = response.data;
            const decodedToken = jwtDecode(data.token);
            const { sub: userId, name: userEmail } = decodedToken;
            localStorage.setItem('token', data.token);
            setCurrentUser({ userId, email: userEmail });
            navigate('/dashboard');
        } catch (err) {
            console.log(err);
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="login-page d-flex justify-content-center align-items-center vh-100">
            <Card className="login-container shadow">
                <Card.Body className="pb-0">
                    <h1 className="login-title text-center mb-4">Log In</h1>

                    <Form onSubmit={handleSubmit} className="login-form">
                        <Form.Group controlId="email" className="mb-2">
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <div className="d-grid">
                            <Button type="submit" disabled={loading} variant="primary" className="w-100">
                                {loading ? 'Loading...' : 'Log In'}
                            </Button>
                        </div>
                    </Form>

                    <div className="signup-container text-center mt-2">
                        <p>
                            Don't have an account? <a href="/register">Sign Up</a>
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default LoginPage;
