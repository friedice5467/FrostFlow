# FrostFlow

## Overview
The React Messaging Application is a real-time messaging platform built with React and ASP.NET Core. It enables users to engage in secure and instant communication through direct messaging and group conversations. This project focuses on practical implementation and provides a great learning experience.

## Features

- **User Authentication/Authorization**: The application ensures secure user registration and login using JWT tokens and ASP.NET Identity.
- **Direct Messaging**: Users can send real-time messages to each other, enabling seamless and instant communication.
- **Group Messaging**: Collaborative conversations are made possible with the ability to create and join groups, allowing users to interact and exchange messages with multiple participants.
- **Real-time Updates**: The application leverages SignalR to provide users with instant updates and notifications for a seamless messaging experience.
- **Stored Messages**: All messages are securely stored and can be accessed for future reference.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Entity Framework**: An ORM framework for working with databases.
- **PostgreSQL**: A relational database management system used for data storage.
- **ASP.NET Core**: A cross-platform framework for building modern web applications.
- **ASP.NET Identity**: A library for user authentication and authorization in ASP.NET applications.
- **SignalR**: A library for adding real-time web functionality to applications.
- **JWT (JSON Web Tokens)**: A secure method for transferring claims between parties as JSON objects.

## Screenshots
![image](https://github.com/friedice5467/FrostFlow/assets/58054670/bd86b801-71be-4b7f-b3be-640af6f7f9f3)
![image](https://github.com/friedice5467/FrostFlow/assets/58054670/f927e049-aa72-4ff8-bd29-0272df8cea6b)

## Getting Started

To run the React Messaging Application locally, follow these steps:

1. Clone the repository: `git clone [repository-url]`
2. Configure the necessary connection string and tokens in the appsettings.json file.
3. Install the dependencies for the React front-end: `npm install`
4. Start the development server and run the API server. The API server will be available at `https://localhost:7272`.
5. Open your web browser and visit: `https://localhost:3000`

## TODO

1. Groups and Channels: Allow users to create and join groups or channels. You could implement private groups where users need an invite or need to request to join, and public groups where anyone can join.
2. Multimedia Messages: Allow users to send more than just text messages. They could send images, videos, or audio messages.
3. Real-time Typing Indicators: Show when someone else is typing a message.
4. Read Receipts: Show when a message has been delivered and read.
5. Emoji Support: Allow users to send emojis. You could also allow custom emojis.
6. Message Reactions: Allow users to react to messages with emojis.
7. Push Notifications: Notify users of new messages even when they're not actively using the chat.

## License

This project is licensed under the APACHE license. See the [LICENSE.txt](LICENSE.txt) file for more details.

## Contributions

Contributions to this project are highly appreciated and welcome. Feel free to submit pull requests or raise issues to contribute to the improvement of the application.

*Note: The React Messaging Application is a project focused on exploring the implementation of real-time messaging functionality with React and ASP.NET Core.*
