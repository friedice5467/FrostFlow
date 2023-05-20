import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const ChatButton = ({ user, onClick }) => {
    const [active, setActive] = useState(false);

    const handleClick = () => {
        setActive(true);
        onClick();
    };

    return (
        <Button
            className="chat-btn w-100"
            variant={active ? 'primary' : 'secondary'}
            onClick={handleClick}
        >
            Chat with {user.userName}
        </Button>
    );
};

export default ChatButton;
