# React Messaging Application

## Overview
This application is a real-time messaging platform built with React and ASP.NET Core. It enables secure communication between users and supports direct and group messaging. The project focuses on practical implementation and learning.

## Features

- **User Authentication/Authorization**: Users can register and log in securely using JWT tokens and ASP.NET Identity.
- **Direct Messaging**: Users can send real-time messages to each other for instant communication.
- **Group Messaging**: Users can create and join groups to engage in collaborative conversations.
- **Real-time Updates**: The application utilizes SignalR for real-time updates, ensuring seamless communication.

## Security
The application emphasizes security by implementing secure authentication using JWT tokens and ASP.NET Identity. All data transmission is encrypted over HTTPS.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **ASP.NET Core**: A cross-platform framework for building modern web applications.
- **ASP.NET Identity**: A library for user authentication and authorization in ASP.NET applications.
- **SignalR**: A library for adding real-time web functionality to applications.
- **JWT (JSON Web Tokens)**: A secure method for transferring claims between parties as JSON objects.

## Getting Started

To run the React Messaging Application locally, follow these steps:

1. Clone the repository in Visual Studio: `git clone [repository-url]`
2. Add the connection string and tokens necesary in appsettings.json
3. Install dependencies in the react front end: `npm install`
4. Start the development server and api
5. Open your web browser and visit: `http://localhost:3000`

## License

This project is licensed under the APACHE license. See the [LICENSE.txt](LICENSE.txt) file for details.

## Contribution

Contributions are welcome.

*Note: This application is a learning project aimed at exploring the implementation of real-time messaging functionality. While it may not have the full feature set of production-grade messaging applications, it serves as a practical introduction to building real-time communication systems.*
