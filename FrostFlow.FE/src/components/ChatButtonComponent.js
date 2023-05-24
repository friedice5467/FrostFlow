import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const ChatButton = ({ session, onClick }) => {
    const [active, setActive] = useState(false);

    const handleClick = () => {
        setActive(true);
        onClick();
    };

    return (
        <Button
            className="chat-btn w-100 rounded-0 border-0"
            variant={active ? 'secondary' : 'outline-secondary'}
            onClick={handleClick}
        >
            Chat with {session.user.userName}
        </Button>
    );
};

export default ChatButton;
