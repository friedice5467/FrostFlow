import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../helpers/api';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const getPasswordStrength = () => {
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
        <Container className="register-page d-flex justify-content-center align-items-center vh-100">
            <Card className="register-container shadow">
                <Card.Body className="register-box pb-0">
                    <h1 className="register-title text-center mb-4">Register</h1>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="email" className="mb-2">
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-2">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="password-strength">
                                Password strength: {getPasswordStrength()}
                            </div>
                        </Form.Group>

                        <Form.Group controlId="confirmPassword" className="mb-2">
                            <Form.Control
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">Register Success!</Alert>}

                        <Button type="submit" disabled={loading} variant="primary" className="w-100">
                            {loading ? 'Loading...' : 'Register'}
                        </Button>
                    </Form>

                    <div className="signup-container text-center mt-2">
                        <p>
                            Already have an account? <a href="/login">Log In</a>
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default RegisterPage;
