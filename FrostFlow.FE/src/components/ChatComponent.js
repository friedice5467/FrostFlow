import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../helpers/AuthContext';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import ResizableWindowComponent from './ResizableWindowComponent';
import './ChatComponent.css';

const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const now = new Date();

    if (dateTime.toDateString() === now.toDateString()) {
        return `Today, ${dateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateTime.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${dateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}`;
    }

    const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };
    return dateTime.toLocaleDateString('en-US', options);
};

const ChatComponent = ({ session, connection, messages }) => {
    const [messageInput, setMessageInput] = useState('');
    const { currentUser } = useAuth();
    const chatTitle = `${session?.user?.userName}`;
    const [messageList, setMessageList] = useState(messages);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        console.log(messageList);
    }, [messageList]);

    const handleSendMessage = useCallback(async () => {
        if (messageInput.trim() !== '' && connection) {
            await connection
                .invoke('SendMessageToUser', session?.user?.id, currentUser?.email, messageInput)
                .catch((err) => console.log(err));

            const newMessage = {
                userId: currentUser?.userId,
                user: currentUser?.email,
                text: messageInput,
                time: new Date().toISOString(),
            };

            setMessageList((prevMessages) => [...prevMessages, newMessage]);
            setMessageInput('');
        }
    }, [connection, currentUser, messageInput, session]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    useEffect(() => {
        if (!connection) return;
        const onReceiveMessage = (sessionId, senderUserId, message, senderUserName, currentTime) => {
            if (sessionId !== session?.id) return;
            setMessageList((prevMessages) => [
                ...prevMessages,
                {
                    userId: senderUserId,
                    user: senderUserName,
                    text: message,
                    time: currentTime,
                },
            ]);
        };

        connection.on('ReceiveMessage', onReceiveMessage);
        return () => connection.off('ReceiveMessage', onReceiveMessage);
    }, [connection, session?.id]);

    useEffect(() => {
        const formattedMessages = messages.map((message) => ({
            userId: message.senderId,
            user: message.senderUserName,
            text: message.text,
            time: message.sentAt,
        }));
        setMessageList(formattedMessages);
    }, [messages]);

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

    if (!currentUser?.email) {
        return null;
    }

    return (
        <ResizableWindowComponent
            initialPosition={{ top: 10, left: 10 }}
            initialSize={{ width: window.innerWidth / 2, height: window.innerHeight / 2 }}
            renderHeader={() => (
                <div className="chat-header">
                    <div className="window-title">
                        <span className="chat-img">{chatTitle}</span>
                        
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
                    <div className={`message-container d-flex align-items-start mb-3 px-2`}>
                        <div className="message-avatar bg-primary d-flex align-items-center justify-content-center rounded-circle">
                            {message.user?.charAt(0)}
                        </div>
                        <div key={`${message.userId}-${index}`}
                            className={`message-content w-100 ${message.userId === currentUser.userId ? 'bg-secondary' : 'bg-light'}`}>
                            <div className="message-text">{message.text}</div>
                            <div className="message-time">{formatDateTime(message.time)}</div>
                        </div>
                    </div>
                ))}
            </PerfectScrollbar>
            <div class="chat-input d-flex align-items-center position-relative">
                <input
                    type="text"
                    className="form-control shadow-none"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <svg
                    onclick={handleSendMessage}
                    class={`send-icon position-absolute ${messageInput.trim() === '' ? 'disabled' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ cursor: messageInput.trim() === '' ? 'default' : 'pointer' }}
                >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
            </div>

        </ResizableWindowComponent>
    );
};

export default ChatComponent;
