import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import styles from "./App.module.scss";
import Conversation from "./components/conversation/Conversation";
import CreateChatRoom from "./components/create-chat-room/CreateChatRoom";
import ChatRooms from "./components/chat-rooms/ChatRooms";

import AuthForm from "./components/auth-form/AuthForm";
import {
	ChatRoom,
	TypingEvent,
	TypingEventData,
} from "./interface/chat.interface";
import { EventTypes } from "./utils/constants";
import { getUserFromLocalStorage } from "./service/storage";
import { UserResponseData } from "./interface/user.interface";

function App() {
	const [selectedChatRoom, setSelectedChatRoom] = useState<
		ChatRoom | undefined
	>();
	const [userSession, setUserSession] = useState<UserResponseData>();
	const [socketIO, setSocketIO] = useState<Socket>();
	const [typingEvent, setTypingEvent] = useState<{
		roomId: string;
		username: string;
		event: TypingEvent;
	}>({
		roomId: "",
		username: "",
		event: "stopped",
	});

	useEffect(() => {
		const userData = getUserFromLocalStorage();

		if (!userData) {
			return;
		}

		setUserSession(userData.user);
	}, []);

	useEffect(() => {
		if (!userSession) return;

		const socket = io("ws://localhost:3001");

		socket.on("connect", () => {
			setSocketIO(socket);
		});

		socket.on("disconnect", (reason) => {
			console.log("Disconnect: " + reason);

			setSocketIO(undefined);
		});

		socket.on(EventTypes.typing, (data: TypingEventData) => {
			if (data.username !== userSession.username) {
				console.log("TypingEventData: ", data);
				setTypingEvent({
					username: data.username,
					roomId: data.roomId,
					event: data.event,
				});
			}
		});
	}, [userSession]);

	const onSelectedChatRoom = (data: ChatRoom) => {
		setSelectedChatRoom(data);
	};

	const updateAuthState = () => {
		const userData = getUserFromLocalStorage();

		if (userData) {
			setUserSession(userData.user);
		}
	};

	return (
		<div className={styles.appContainer}>
			{userSession && (
				<>
					<div className={styles.appLeftSection}>
						<div>
							<div className={styles.socketConnection}>
								{socketIO ? (
									<span className={styles.connected}>
										Connected
									</span>
								) : (
									<span className={styles.disconnected}>
										Disconnected
									</span>
								)}
							</div>
							<CreateChatRoom />
							<ChatRooms
								typingEvent={typingEvent}
								shouldShowTyping={
									typingEvent.username !==
									userSession.username
								}
								socketIO={socketIO}
								onSelectedChatRoom={onSelectedChatRoom}
							/>
						</div>
					</div>
					<Conversation
						typingEvent={typingEvent}
						userSession={userSession}
						socketIO={socketIO}
						chatRoomDetails={selectedChatRoom}
					/>
				</>
			)}

			{!userSession && <AuthForm updateAuthState={updateAuthState} />}
		</div>
	);
}

export default App;
