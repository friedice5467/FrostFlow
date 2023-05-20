import React, { useState } from 'react';
import api from '../helpers/api';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './UserSearchPopup.css';
import LoadingModal from './LoadingModal';
import ApiExceptionModal from './ApiExceptionModal';
import { useAuth } from '../helpers/AuthContext';

const UserSearch = ({ closePopup, startChat, activeChats }) => {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();

    const handleSearch = async () => {
        if (query.trim() === '') {
            return; // Exit early if search field is empty
        }
        setLoading(true);
        try {
            const response = await api.get(`identity/search?query=${query}`);
            const filteredUsers = response.data.filter(user => user.id !== currentUser.userId);
            setUsers(filteredUsers);
        } catch (error) {
            setError(`${error}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (user, isChecked) => {
        if (isChecked) {
            setSelectedUsers([...selectedUsers, user]);
        } else {
            setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.id !== user.id));
        }
    };

    const startPrivateChat = (user) => {
        if (!activeChats[user.id]) {
            startChat(user);
        } else {
            console.log(`Chat with user ${user.userName} already exists`);
        }
    };

    const startGroupChat = () => {
        // Logic to create a group using the selectedUsers list
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Modal show onHide={closePopup} centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>User Search</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group as={Row} controlId="searchForm">
                    <Col xs={12} sm={9}>
                        <Form.Control
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Search users"
                        />
                    </Col>
                    <Col xs={12} sm={3}>
                        <Button variant="primary" onClick={handleSearch} className="w-100">
                            Search
                        </Button>
                    </Col>
                </Form.Group>
                <PerfectScrollbar options={{ wheelPropagation: true }} className="scrollbar mt-2 px-1">
                    {users.map(user => (
                        <Form.Check
                            key={user.id}
                            type="checkbox"
                            id={`checkbox-${user.id}`}
                            label={user.userName}
                            onChange={(e) => handleCheckboxChange(user, e.target.checked)}
                        />
                    ))}
                </PerfectScrollbar>
            </Modal.Body>
            <Modal.Footer className="py-2">
                <Button onClick={() => selectedUsers.length === 1 ? startPrivateChat(selectedUsers[0]) : startGroupChat()}>
                    Start Chat
                </Button>
                <Button variant="secondary" onClick={closePopup}>
                    Close
                </Button>
            </Modal.Footer>
            {loading && <LoadingModal />}
            {error && <ApiExceptionModal error={error} onClose={() => setError('')} />}
        </Modal>
    );
};

export default UserSearch;
