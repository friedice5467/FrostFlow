import React, { useEffect, useState } from 'react';
import { useAuth } from '../helpers/AuthContext';
import * as signalR from '@microsoft/signalr';

import './DashboardPage.css';

const ChatComponent = ({ userId, connection }) => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const { currentUser } = useAuth();
    const chatTitle = `Chat with ${userId}`; // Assuming userId is the username. Replace as necessary.

    useEffect(() => {
        if (connection) {
            connection.on('ReceiveMessage', (senderUserId, message) => {
                if (senderUserId === userId) {
                    console.log(message);
                    setMessages((messages) => [
                        ...messages,
                        { user: userId, text: message },
                    ]);
                }
            });

            // clean up on unmount
            return () => {
                connection.off('ReceiveMessage');
            };
        }
    }, [connection, userId]);

    const handleSendMessage = async () => {
        if (messageInput !== '' && connection) {
            await connection
                .invoke('SendMessageToUser', userId, messageInput)
                .catch((err) => console.log(err));

            const newMessage = {
                user: currentUser.email, // Use email from the auth context
                text: messageInput,
                time: new Date().toISOString(), // Use current date and time
            };

            setMessages((messages) => [...messages, newMessage]);
            setMessageInput('');
        }
    };

    if (!currentUser.email) {
        return null; // Render nothing if currentUser is not available yet
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>{chatTitle}</h2>
            </div>
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        <div className="message-avatar">{currentUser.email.charAt(0)}</div>
                        <div className="message-content">
                            <div className="chat-message-text">{message.text}</div>
                            <div className="message-info">
                                <div className="message-sender">{message.user}</div>
                                <div className="message-time">{message.time}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                />
                <button className="send-message-btn" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatComponent;
