import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import ChatRoom from "../chat-room/ChatRoom";
import styles from "./ChatRooms.module.scss";
import {
	ChatRoom as ChatRoomInterface,
	TypingEvent,
} from "../../interface/chat.interface";

import ApiService from "../../service/axios";
import { ApiResponse } from "../../interface/api.interface";
import { EventTypes } from "../../utils/constants";

interface ChatRoomsProps {
	onSelectedChatRoom(data: ChatRoomInterface): void;
	socketIO: Socket | undefined;
	shouldShowTyping: boolean;
	typingEvent: {
		roomId: string;
		username: string;
		event: TypingEvent;
	};
}

const ChatRooms = (props: ChatRoomsProps) => {
	const { onSelectedChatRoom, shouldShowTyping, typingEvent, socketIO } =
		props;

	const [selectedChat, setSelectedChat] = useState(-1);
	const [chatRooms, setChatRooms] = useState<ChatRoomInterface[]>([]);

	useEffect(() => {
		ApiService.get<ApiResponse<ChatRoomInterface[]>>("/chat")
			.then((response) => {
				const { data } = response;

				if (data.data) {
					setChatRooms(data.data);
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	useEffect(() => {
		if (socketIO) {
			socketIO.on(EventTypes.roomCreated, (data: ChatRoomInterface) => {
				setChatRooms((prev) => [data, ...prev]);
			});
		}
	}, [socketIO]);

	const onChatRoomSelect = (chatId: number, chat: ChatRoomInterface) => {
		setSelectedChat(chatId);

		onSelectedChatRoom(chat);

		if (socketIO) {
			socketIO.emit(EventTypes.joinRoom, {
				roomId: chat.roomId,
			});
		}
	};

	const chatRoomTyping = (roomId: string) => {
		return (
			shouldShowTyping &&
			typingEvent.event === "typing" &&
			typingEvent.roomId === roomId
		);
	};

	return (
		<div className={styles.userListContainer}>
			<div className={styles.title}>Chat Rooms</div>
			<div className={styles.chatList}>
				{chatRooms.map((chatRoom, index) => (
					<ChatRoom
						key={`chat-item-${index}`}
						chatRoom={chatRoom}
						chatRoomTyping={chatRoomTyping(chatRoom.roomId)}
						isSelected={index === selectedChat}
						onChatRoomSelect={() =>
							onChatRoomSelect(index, chatRoom)
						}
					/>
				))}

				{chatRooms.length === 0 && (
					<div className={styles.noChatRooms}>
						<div>No chat rooms</div>
						<div>Create new chat room</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatRooms;
