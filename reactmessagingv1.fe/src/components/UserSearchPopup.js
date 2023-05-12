import React, { useState } from 'react';
import api from '../helpers/api';

const UserSearch = ({ closePopup, startChat, activeChats }) => {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleSearch = async () => {
        const response = await api.get(`identity/search?query=${query}`);
        setUsers(response.data);
    };

    const handleCheckboxChange = (userId, isChecked) => {
        if (isChecked) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        }
    };

    const startPrivateChat = (userId) => {
        if (!activeChats[userId]) {
            startChat(userId);
        } else {
            console.log(`Chat with user ${userId} already exists`);
        }
    };

    const startGroupChat = () => {
        // Logic to create a group using the selectedUsers list
    };

    return (
        <div>
            <button className="close-popup-btn" onClick={closePopup}>X</button>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
            <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                {users.map(user => (
                    <div key={user.id}>
                        <input type="checkbox" onChange={(e) => handleCheckboxChange(user.id, e.target.checked)} />
                        {user.userName}
                    </div>
                ))}
            </div>
            <button onClick={() => selectedUsers.length === 1 ? startPrivateChat(selectedUsers[0]) : startGroupChat()}>Start Chat</button>
        </div>
    );
};

export default UserSearch;
