import React, { useEffect, useState } from 'react';
import { useAuth } from '../helpers/AuthContext';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import ResizableWindowComponent from './ResizableWindowComponent';
import './ChatComponent.css';

const ChatComponent = ({ session, connection, messages }) => {
    const [messageInput, setMessageInput] = useState('');
    const { currentUser } = useAuth();
    const chatTitle = `Chat with ${session?.user?.userName}`;
    const [messageList, setMessageList] = useState(messages);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        const formattedMessages = messages.map((message) => ({
            user: message.senderUserName,
            text: message.text,
            time: message.sentAt,
        }));
        setMessageList(formattedMessages);
    }, [messages]);

    useEffect(() => {
        if (connection) {
            connection.on(
                'ReceiveMessage',
                (sessionId, senderUserId, message, senderUserName, currentTime) => {
                    if (sessionId === session?.id) {
                        console.log(message);
                        const newMessage = {
                            user: senderUserName,
                            text: message,
                            time: currentTime,
                        };
                        setMessageList((prevMessages) => [...prevMessages, newMessage]);
                    }
                }
            );

            // clean up on unmount
            return () => {
                connection.off('ReceiveMessage');
            };
        }
    }, [connection, session?.id]);

    const handleSendMessage = async () => {
        if (messageInput.trim() !== '' && connection) {
            await connection
                .invoke('SendMessageToUser', session?.user?.id, currentUser?.email, messageInput)
                .catch((err) => console.log(err));

            const newMessage = {
                user: currentUser?.email,
                text: messageInput,
                time: new Date().toISOString(),
            };

            setMessageList((prevMessages) => [...prevMessages, newMessage]);
            setMessageInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleMinimize = () => {
        setIsMinimized(true);
    };

    const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    const handleClose = () => {
        // Perform any cleanup or closing actions here
        console.log('Chat window closed');
    };

    const formatDateTime = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        const options = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };
        return dateTime.toLocaleDateString('en-US', options);
    };

    if (!currentUser?.email || isMinimized) {
        return null;
    }

    return (
        <ResizableWindowComponent
            initialPosition={{ top: '2%', left: '25%' }}
            initialSize={{ width: '900px', height: '930px' }}
            renderHeader={() => (
                <div className="chat-header">
                    <div className="window-title">
                        <h2>{chatTitle}</h2>
                    </div>
                    <div className="window-controls">
                        <button className="minimize" onClick={handleMinimize}></button>
                        <button className="maximize" onClick={handleMaximize}></button>
                        <button className="close" onClick={handleClose}></button>
                    </div>
                </div>
            )}
        >
            <PerfectScrollbar options={{ wheelPropagation: true }} className="flex-grow-1">
                {messageList.map((message, index) => (
                    <div key={index} className="message-container d-flex align-items-start mb-3">
                        <div className="message-avatar bg-primary d-flex align-items-center justify-content-center rounded-circle">
                            {message.user?.charAt(0)}
                        </div>
                        <div className="message-content">
                            <div className="message-sender">{message.user}</div>
                            <div className="message-text">{message.text}</div>
                            <div className="message-time">{formatDateTime(message.time)}</div>
                        </div>
                    </div>
                ))}
            </PerfectScrollbar>
            <div className="chat-input d-flex align-items-center mt-2 mb-1">
                <input
                    type="text"
                    className="form-control rounded-0 shadow-none"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="btn btn-primary ml-auto rounded-pill" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </ResizableWindowComponent>
    );
};

export default ChatComponent;
