import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from "../helpers/AuthContext";
import ChatComponent from './ChatComponent';
import UserSearch from './UserSearchPopup';
import { Container, Row, Col, Button, Navbar, Dropdown } from 'react-bootstrap';
import { Accordion, AccordionItem as Item} from '@szhsin/react-accordion';
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
    const [currentSession, setCurrentSession] = useState(null);
    const [selectedSessionMessages, setSelectedSessionMessages] = useState([]);
    const [collapsed, setCollapsed] = useState(false);

    const AccordionItem = ({ header, ...rest }) => (
        <Item
            {...rest}
            header={
                <>
                    {header}
                    <img className="chevron-down" src='/chevron-down.svg' alt="Chevron Down" />
                </>
            }
        />
    );

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

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
            <Container fluid className="dashboard-container mx-0 px-0 h-100 bg-dark">
                <Row className="mx-0">
                    <Col xs={12} className="px-0">
                        <Navbar bg="dark" variant="dark" expand="lg" className="flex-md-nowrap p-0 shadow">
                            <Button variant="outline-dark" onClick={toggleSidebar}><span className="navbar-toggler-icon"></span></Button>
                            <Navbar.Brand href="#home" className="col-sm-3 col-md-2 mr-0 ms-2">App</Navbar.Brand>
                            <Navbar.Collapse id="basic-navbar-nav" className="px-3 d-flex justify-content-end">
                                <Dropdown>
                                    <Dropdown.Toggle variant="dark" className="profile-gravatar" id="dropdown-basic">
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu align="right">
                                        <Dropdown.Item href="#action/3.1">Settings</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Navbar.Collapse>
                        </Navbar>
                    </Col>
                </Row>
                <Row className="h-100 mx-0">
                    <Col xs={collapsed ? 0 : 2} md={collapsed ? 0 : 2} className={`${collapsed ? "d-none" : ""} sidebar bg-dark text-white d-flex flex-column align-items-center px-0`}>
                        {(
                            <Accordion className="w-100" transition transitionTimeout={250}>
                                <AccordionItem header="Chats" className="w-100 ">
                                        {Object.values(activeChats).map((session) => (
                                            <Button
                                                variant="" className="w-100 rounded-0 " key={session.id} onClick={() => handleChatButtonClick(session, session.user)}>
                                                {session.user.userName}
                                            </Button>
                                        ))}
                                </AccordionItem>
                            </Accordion>
                        )}
                        {showPopup && (
                            <UserSearch
                                closePopup={() => setShowPopup(false)}
                                startSession={handleStartChat}
                                connection={connection}
                                activeChats={activeChats}
                            />
                        )}
                    </Col>
                    <Col xs={collapsed ? 12 : 10} md={collapsed ? 12 : 10} className="px-0 main">
                        <div className="d-flex flex-column align-items-center justify-content-center">
                            {currentSession && (
                                <ChatComponent
                                    session={currentSession}
                                    connection={connection}
                                    messages={selectedSessionMessages}
                                />)}
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default DashboardPage;