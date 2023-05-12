import React from 'react';

const ChatButton = ({ userId, onClick }) => {
    return (
        <button className="chat-btn" onClick={onClick}>
            Chat with {userId}
        </button>
    );
};

export default ChatButton;
