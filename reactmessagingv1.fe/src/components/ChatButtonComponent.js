import React from 'react';

const ChatButton = ({ user, onClick }) => {
    return (
        <button className="chat-btn" onClick={onClick}>
            Chat with {user.userName}
        </button>
    );
};

export default ChatButton;
