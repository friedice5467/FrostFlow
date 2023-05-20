import React, { useEffect, useState } from 'react';
import { useAuth } from '../helpers/AuthContext';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './ChatComponent.css';

const ChatComponent = ({ user, connection }) => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const { currentUser } = useAuth();
    const chatTitle = `Chat with ${user.userName}`;

    useEffect(() => {
        if (connection) {
            connection.on('ReceiveMessage', (senderUserId, message, senderUserName, currentTime) => {
                if (senderUserId === user.id) {
                    console.log(message);
                    setMessages((prevMessages) => [
                        { user: senderUserName, text: message, time: currentTime },
                        ...prevMessages,
                    ].sort((a, b) => new Date(a.time) - new Date(b.time)));
                }
            });

            // clean up on unmount
            return () => {
                connection.off('ReceiveMessage');
            };
        }
    }, [connection, user]);

    const handleSendMessage = async () => {
        if (messageInput !== '' && connection) {
            await connection.invoke('SendMessageToUser', user.id, currentUser.email, messageInput).catch((err) => console.log(err));

            const newMessage = {
                user: currentUser.email,
                text: messageInput,
                time: new Date().toISOString(),
            };

            setMessages((prevMessages) => [
                ...prevMessages,
                newMessage,
            ]);
            setMessageInput('');
        }
    };

    if (!currentUser.email) {
        return null;
    }

    const formatDateTime = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
        return dateTime.toLocaleDateString('en-US', options);
    };

    return (
        <div className="chat-container d-flex flex-column h-100">
            <div className="chat-header">
                <h2>{chatTitle}</h2>
            </div>
            <PerfectScrollbar options={{ wheelPropagation: true }} className="flex-grow-1">
                {messages.slice().reverse().map((message, index) => (
                    <div key={index} className="d-flex align-items-center mb-3">
                        <div className="message-avatar bg-primary d-flex align-items-center justify-content-center rounded-circle avatar">
                            {message.user.charAt(0)}
                        </div>
                        <div className="message-content ps-1">
                            <div className="chat-message-text">{message.text}</div>
                            <div className="message-info d-flex">
                                <div className="message-sender text-primary mr-2">{message.user}</div>
                                <div className="message-time text-secondary">{formatDateTime(message.time)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </PerfectScrollbar>
            <div className="chat-input d-flex align-items-center mt-1 mb-3">
                <input
                    type="text"
                    className="form-control flex-grow-1"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                />
                <button className="btn btn-primary ml-2" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;
