import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from "../helpers/AuthContext";
import ChatComponent from './ChatComponent';
import ChatButton from './ChatButtonComponent';
import UserSearch from './UserSearchPopup';

import "./DashboardPage.css";

const DashboardPage = () => {
    const { logout } = useAuth();
    const [connection, setConnection] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [chatUserId, setChatUserId] = useState(null);
    const [activeChats, setActiveChats] = useState({});

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7272/chatHub", {
                accessTokenFactory: () => localStorage.getItem('token'),
            })
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => console.log('Connection started!'))
                .catch(err => console.log('Error while establishing connection :('));

            const handleAcceptChatRequest = (senderUserId) => {
                if (!activeChats[senderUserId]) {
                    console.log(senderUserId);
                    const chatButton = <ChatButton key={senderUserId} userId={senderUserId} onClick={() => setChatUserId(senderUserId)} />;
                    setActiveChats(prevChats => ({ ...prevChats, [senderUserId]: chatButton }));
                } else {
                    console.log(`Chat with user ${senderUserId} already exists`);
                }
            };

            connection.on("ReceiveChatRequest", (senderUserId) => {
                console.log(`Chat request received from ${senderUserId}`);
                handleAcceptChatRequest(senderUserId);
            });

            connection.on("ReceiveMessage", (senderUserId, message) => {
                console.log(`Message received from ${senderUserId}`);

                if (!activeChats[senderUserId]) {
                    handleAcceptChatRequest(senderUserId);
                }
            });

            // clean up on unmount
            return () => {
                connection.stop()
                    .then(() => console.log('Connection stopped!'))
                    .catch(err => console.log('Error while stopping connection :('));

                connection.off("ReceiveChatRequest");
                connection.off("ReceiveMessage");
            };
        }
    }, [connection]);


    const handleStartChat = (userId) => {
        if (!activeChats[userId]) {
            const chatButton = <ChatButton key={userId} userId={userId} onClick={() => setChatUserId(userId)} />;
            setActiveChats(prevChats => ({ ...prevChats, [userId]: chatButton }));
            setShowPopup(false);

            // Send chat request to the other user
            connection.invoke("SendChatRequest", userId).catch(err => console.log(err));
            console.log("Chat request sent");
        } else {
            console.log(`Chat with user ${userId} already exists`);
        }
    };


    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="avatar">P</div>
                <div className="chat-buttons">
                    {Object.values(activeChats)}
                </div>
                <div className="sidebar-buttons">
                    <button className="sidebar-btn" onClick={() => setShowPopup(!showPopup)}>Find Users</button>
                    <button className="sidebar-btn">Settings</button>
                    <button className="sidebar-btn" onClick={logout}>Logout</button>
                </div>
                {showPopup && <UserSearch closePopup={() => setShowPopup(false)} startChat={handleStartChat} connection={connection} activeChats={activeChats} />}
            </div>
            <div className="main">
                {chatUserId && <ChatComponent userId={chatUserId} connection={connection} />}
            </div>
        </div>
    );
};

export default DashboardPage;
