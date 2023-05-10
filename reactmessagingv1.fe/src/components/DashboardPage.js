import React, { useState } from "react";
import { useAuth } from "../helpers/AuthContext";

import "./DashboardPage.css";

const DashboardPage = () => {
    const { logout } = useAuth();
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "John Doe",
            time: "10:00 AM",
            text: "Hey, how's it going?",
        },
        {
            id: 2,
            sender: "Jane Smith",
            time: "10:05 AM",
            text: "Not bad, you?",
        },
        {
            id: 3,
            sender: "John Doe",
            time: "10:10 AM",
            text: "Pretty good, thanks!",
        },
    ]);

    const handleSendMessage = () => {
        if (messageInput !== "") {
            const newMessage = {
                id: messages.length + 1,
                sender: "You",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: messageInput,
            };
            setMessages([...messages, newMessage]);
            setMessageInput("");
        }
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="avatar">P</div>
                <div className="sidebar-buttons">
                    <button className="sidebar-btn">Settings</button>
                    <button className="sidebar-btn" onClick={logout}>Logout</button>
                </div>
            </div>
            <div className="main">
                <div className="messages">
                    {messages.map((message) => (
                        <div key={message.id} className="message">
                            <div className="message-avatar">{message.sender.charAt(0)}</div>
                            <div className="message-content">
                                <div className="message-text">{message.text}</div>
                                <div className="message-info">
                                    <span className="message-sender">{message.sender}</span>
                                    <span className="message-time">{message.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="message-input">
                    <input
                        type="text"
                        placeholder="Type a message"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <button className="send-message-btn" onClick={handleSendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
