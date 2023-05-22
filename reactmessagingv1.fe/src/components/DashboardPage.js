import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from "../helpers/AuthContext";
import ChatComponent from './ChatComponent';
import ChatButton from './ChatButtonComponent';
import UserSearch from './UserSearchPopup';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './DashboardPage.css';
import api from '../helpers/api';
import LoadingModal from './LoadingModal';
import ApiExceptionModal from './ApiExceptionModal';

const DashboardPage = () => {
    const { logout, currentUser } = useAuth();
    const [connection, setConnection] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [activeChats, setActiveChats] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chatSessions, setChatSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [selectedSessionMessages, setSelectedSessionMessages] = useState([]);

    const fetchChatSessions = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/Chat/Sessions/${currentUser.userId}`);
            const sessions = response.data;

            // Convert sessions to active buttons
            sessions.forEach(session => {
                const { sessionId, chatSessionUsers } = session;
                const user = chatSessionUsers.find(csu => csu.userId !== currentUser.userId)?.user;

                // Check if active button already exists
                if (!activeChats[sessionId] && user) {
                    setActiveChats(prevChats => ({
                        ...prevChats,
                        [sessionId]: {
                            id: sessionId,
                            user: {
                                id: user.id,
                                userName: user.userName
                            }
                        }
                    }));
                }
            });

            setIsLoading(false);
        } catch (e) {
            setError(e.message);
            setIsLoading(false);
        }
    };

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
            connection
                .start()
                .then(() => console.log('Connection started!'))
                .catch((err) => console.log('Error while establishing connection :('));

            connection.on("ReceiveChatRequest", (sessionId, senderUserId, senderUserName) => {
                console.log(`Chat request received from ${senderUserName}`);
                setActiveChats(prevChats => ({ ...prevChats, [sessionId]: { id: sessionId, user: { id: senderUserId, userName: senderUserName } } }));
            });

            // clean up on unmount
            return () => {
                connection
                    .stop()
                    .then(() => console.log('Connection stopped!'))
                    .catch((err) => console.log('Error while stopping connection :('));

                connection.off("ReceiveChatRequest");
            };
        }
    }, [connection]);

    useEffect(() => {
        fetchChatSessions();
    }, []);

    const fetchMessagesForSession = async (sessionId) => {
        console.log('fetch message is fired');
        if (sessionId) {
            try {
                setIsLoading(true);
                const response = await api.get(`/Chat/Messages/${sessionId}`);
                setSelectedSessionMessages(response.data);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        }
    };

    const handleStartChat = async (session, user) => {
        console.log('Handlestart chat is fired');
        setActiveChats(prevChats => ({ ...prevChats, [session.id]: { id: session.id, user: { id: user.id, userName: user.userName } } }));
        setCurrentSession(session);
        setShowPopup(false);

        // Send chat request to the other user
        connection.invoke("SendChatRequest", session.id, currentUser.email).catch((err) => console.log(err));
        console.log(`Chat request sent as ${currentUser.email}`);
        fetchMessagesForSession(session.id);
    };

    const handleChatButtonClick = (session, user) => {
        if (!currentSession || currentSession.id !== session.id) {
            console.log('chat button is clicked');
            handleStartChat(session, user);
        }
    };

    return (
        <>
            {isLoading && <LoadingModal />}
            {error && <ApiExceptionModal error={error} onClose={() => setError(null)} />}
            <Container fluid className="dashboard-container h-100 mx-0 px-0 bg-light">
                <Row className="h-100 mx-0">
                    <Col xs={12} md={2} className="sidebar bg-dark text-white d-flex flex-column align-items-center justify-content-between px-0">
                        <div className="avatar bg-primary d-flex align-items-center justify-content-center rounded-circle">P</div>
                        <div className="chat-buttons w-100">
                            {Object.values(activeChats).map((session) => (
                                <ChatButton key={session.id} session={session} onClick={() => handleChatButtonClick(session, session.user)} />
                            ))}
                        </div>
                        <div className="sidebar-buttons w-100">
                            <Button
                                variant="outline-secondary"
                                className="sidebar-btn w-100 text-white btn-rounded-0"
                                onClick={() => setShowPopup(!showPopup)}
                            >
                                Find Users
                            </Button>
                            <Button
                                variant="outline-secondary"
                                className="sidebar-btn w-100 text-white btn-rounded-0"
                            >
                                Settings
                            </Button>
                            <Button
                                variant="outline-secondary"
                                className="sidebar-btn w-100 text-white btn-rounded-0"
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </div>
                        {showPopup && (
                            <UserSearch
                                closePopup={() => setShowPopup(false)}
                                startSession={handleStartChat}
                                connection={connection}
                                activeChats={activeChats}
                            />
                        )}
                    </Col>
                    <Col xs={12} md={10} className="main d-flex flex-column align-items-center justify-content-center">
                        {currentSession && (
                            <ChatComponent
                                session={currentSession}
                                connection={connection}
                                messages={selectedSessionMessages}
                            />
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default DashboardPage;
