import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from "../helpers/AuthContext";
import ChatComponent from './ChatComponent';
import ChatButton from './ChatButtonComponent';
import UserSearch from './UserSearchPopup';
import "./DashboardPage.css";

const DashboardPage = () => {
    const { logout, currentUser } = useAuth();
    const [connection, setConnection] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [chatUser, setChatUser] = useState(null);
    const [activeChats, setActiveChats] = useState({});
    const [messages, setMessages] = useState([]);

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

            const handleAcceptChatRequest = (senderUser) => {
                if (!activeChats[senderUser.id]) {
                    setActiveChats((prevChats) => ({ ...prevChats, [senderUser.id]: senderUser }));
                    setChatUser(senderUser); 
                } else {
                    console.log(`Chat with user ${senderUser.userName} already exists`);
                }
            };


            connection.on("ReceiveChatRequest", (senderUserId, senderUserName) => {
                console.log(`Chat request received from ${senderUserName}`);
                handleAcceptChatRequest({ id: senderUserId, userName: senderUserName });
            });

            connection.on("ReceiveMessage", (senderUserId, message, senderUserName, currentTime) => {
                console.log(`Message received from ${senderUserName}: ${message}`);

                if (senderUserId === chatUser?.id) {
                    setMessages((messages) => [
                        ...messages,
                        { user: senderUserName, text: message, time: currentTime },
                    ].sort((a, b) => new Date(a.time) - new Date(b.time)));
                } else {
                    handleAcceptChatRequest({ id: senderUserId, userName: senderUserName });
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

    const handleStartChat = (user) => {
        if (!activeChats[user.id]) {
            setActiveChats(prevChats => ({ ...prevChats, [user.id]: user }));
            setChatUser(user); 
            setShowPopup(false);

            // Send chat request to the other user
            connection.invoke("SendChatRequest", user.id, currentUser.email).catch(err => console.log(err));
            console.log(`Chat request sent as ${currentUser.email}`);
        } else {
            console.log(`Chat with user ${user.userName} already exists`);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="avatar">P</div>
                <div className="chat-buttons">
                    {Object.values(activeChats).map(user => (
                        <ChatButton key={user.id} user={user} onClick={() => setChatUser(user)} />
                    ))}
                </div>
                <div className="sidebar-buttons">
                    <button className="sidebar-btn" onClick={() => setShowPopup(!showPopup)}>Find Users</button>
                    <button className="sidebar-btn">Settings</button>
                    <button className="sidebar-btn" onClick={logout}>Logout</button>
                </div>
                {showPopup && <UserSearch closePopup={() => setShowPopup(false)} startChat={handleStartChat} connection={connection} activeChats={activeChats} />}
            </div>
            <div className="main">
                {console.log('chatUser in render:', chatUser)}
                {chatUser && <ChatComponent user={chatUser} connection={connection} />}
            </div>
        </div>
    );
};

export default DashboardPage;
