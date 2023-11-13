# Project Introduction

Welcome to the **Chat App** documentation. This chat application is designed to enable real-time communication between users in a secure and efficient manner. It leverages a modern technology stack to deliver a seamless chat experience.

## Technologies Used

The chat app makes use of the following technologies:

- **WebSockets:** Real-time communication is achieved through WebSocket connections, allowing instant message delivery and updates.
- **Kafka:** Kafka acts as a message broker to handle and distribute server events and messages efficiently.
- **MySQL:** MySQL is employed as the relational database to store user data, chat room details, and message history.
- **Redis:** Redis serves as a cache store for chat messages, providing fast and efficient retrieval of recent messages.
- **Docker:** Docker containers are utilized to containerize and manage various components of the application.
- **Express.js:** Express.js is the backend framework for handling API requests and managing WebSocket connections.
- **React:** The frontend of the chat app is built using React
- **TypeScript:** TypeScript is used to ensure code reliability and type safety.

# Setup

This is a mono-repo via [pnpm](https://pnpm.io/) containing client app, server, docker scripts.

## Project structure

- ./chat-app/
  - /**app**/client
  - /**app**/server
  - /**services**/db
  - /**services**/kafka
  - /**services**/rabbitmq

To get up and running please follow these step:

1. Install pnpm globally by running: `npm install -g pnpm`
2. On the root directory of the project run: `pnpm install`
3. Since this is just for development, I have left the required `.env` files

#### Docker services

Please make sure you have docker installed and running on your machine for the following:

1. Change directory: `cd services/kafka` then run `docker-compose up -d`
2. Change directory: `cd services/db` then run `docker-compose up -d`
3. Change directory: `cd services/rabbitmq` then run `docker-compose up -d`

Double check if all containers are healthy (running)

#### Creating database

Run the following command for migrations:
`pnpm run server:migrate`

Then to seed our database with info, run:
`pnpm run server:seed`

#### Running the apps

You can run both client and server in parallel or choose to run separately:

- To run parallel: `pnpm run dev`
- To run them separately:
  For server: `pnpm run server`
  For client: `pnpm run client`

Frontend URL: http://localhost:5172/
API server URL: http://localhost:3001
WebSocket server: http://localhost:3001

To be able to use the app, you must create an account then login. Create second account on different browser, also login there.

Create a chat room to start chatting.

#### Running tests

Although I only have one backend test, using supertest

To run tests: `pnpm run server:test`

# Event Types

Various event types used in the chat application for communication between the server and clients. These events facilitate real-time messaging, room management, and user interaction.

## room-created

- **Description:** This event is triggered when a new chat room is created.
- **Usage:**
  - A producer sends this event to Kafka when a new chat room is created.
  - A consumer receives the event and broadcasts it to all clients connected to the WebSocket server.
- **Payload:** The event may include information about the newly created chat room, such as its name, picture, and room ID.

## join-room

- **Description:** This event is sent when a user joins a chat room.
- **Usage:** When a user enters a chat room, this event is used to notify the server about the user's presence.
- **Payload:** The event only includes room ID.

## new-message

- **Description:** This event is triggered when a new message is sent by a user.
- **Usage:**
  - Client sends this event via WebSocket connection
  - Storing the message details to the database
  - A producer sends this event to Kafka.
  - A consumer receives the event and broadcasts it to all clients connected to a specific chat room via WebSocket server.
- **Payload:** The event includes the message content, sender's information, and the target chat room [roomId].

## broadcast-message

- **Description:** This event is used to broadcast a message to a specific chat room.
- **Usage:** It allows sending a message to all participants in a particular chat room.
- **Payload:** The event includes the message content, sender's information, and the target chat room.

## typing

- **Description:** This event notifies users about typing activity in a chat room.
- **Usage:** When a user starts typing a message, this event is triggered to inform others in the same chat room.
- **Payload:** The event includes information about the user who is currently typing.

They facilitate communication, room management, and user engagement, ensuring a seamless chat experience.

## Todo list

1. **Servers**

- [x] Setup Express Js
- [x] Setup Kafka
- [ ] Setup RabbitMQ
- [x] Setup Redis
- [x] Setup MySQL
- [x] Setup Socket.io for websocket

2. **Database creation**

- [x] users: id, username, email, password, picture
- [x] chat_rooms
- [x] chat_messages
- [x] user_chat_room

# Missing Deliverables

This section outlines the aspects of the project that were planned but could not be fully implemented due to various reasons. It provides transparency about what remains to be done.

I was unable to conduct the tests as required due to the significant demands on my time, which required me to balance my professional commitments and the take-home assessment. My work responsibilities had left me with a full schedule, making it challenging to complete the tests within the time-frame.

I apologize for any inconvenience this may have caused.

## Setup of RabbitMQ

- **Description:** The initial plan included the setup of RabbitMQ, a message broker, to enable the logging of certain server events.
- **Reason:** Due to unforeseen circumstances, the RabbitMQ integration was not completed.
- **Status:** This feature remains pending

## Tracking User Online Statuses Using Redis

- **Description:** The project intended to implement user online status tracking using Redis.
- **Reason:** The feature was not fully implemented due to time constraints and I had to prioritize tasks.

## Unit Testing and API Testing

- **Description:** The project planned to include unit testing and API testing as part of the quality assurance process.
- **Reason:** Due to unforeseen circumstances and time limitations critical development tasks took precedence, resulting in the inability to conduct comprehensive testing.
