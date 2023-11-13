import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import UserImage from "../chat-room-image/ChatRoomImage";
import styles from "./Conversation.module.scss";
import ChatInput from "../chat-input/ChatInput";
import { UserResponseData } from "../../interface/user.interface";
import ChatBubble from "../chat-bubble/ChatBubble";
import {
	ChatRoom,
	MessageContent,
	TypingEvent,
	TypingEventData,
} from "../../interface/chat.interface";
import { EventTypes } from "../../utils/constants";
import ApiService from "../../service/axios";
import { ApiResponse } from "../../interface/api.interface";

interface ConversationProps {
	chatRoomDetails: ChatRoom | undefined;
	socketIO: Socket | undefined;
	userSession: UserResponseData;
	typingEvent: {
		roomId: string;
		event: TypingEvent;
	};
}

const Conversation = (props: ConversationProps) => {
	const { chatRoomDetails, typingEvent, userSession, socketIO } = props;

	const [conversations, setConversations] = useState<MessageContent[]>([]);
	const conversationElemRef = useRef<HTMLDivElement | null>(null);
	const chatRoomDetailsRef = useRef<ChatRoom>();

	const scrollBottom = () => {
		if (conversationElemRef.current) {
			conversationElemRef.current.scrollTo({
				behavior: "auto",
				top: conversationElemRef.current.scrollHeight * 2,
			});
		}
	};

	useEffect(() => {
		if (chatRoomDetails) {
			chatRoomDetailsRef.current = chatRoomDetails;

			ApiService.get<ApiResponse<MessageContent[]>>(
				`/chat/${chatRoomDetails.roomId}/messages`,
			)
				.then((response) => {
					const { data } = response;

					const messages = data.data;

					if (messages) {
						setConversations(messages);

						scrollBottom();
					}
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [chatRoomDetails]);

	useEffect(() => {
		console.log(socketIO);

		if (socketIO) {
			// Receive an event from kafka->websocket
			socketIO.on(EventTypes.broadcastMessage, (data: MessageContent) => {
				if (data.roomId === chatRoomDetailsRef.current?.roomId) {
					setConversations((prev) => [data, ...prev]);

					scrollBottom();
				}
			});
		}
	}, [socketIO]);

	const onInput = (content: string) => {
		if (chatRoomDetails && userSession) {
			if (socketIO) {
				const dateNow = new Date();

				const message: MessageContent = {
					roomId: chatRoomDetails.roomId,
					content,
					username: userSession.username,
					time: dateNow.toISOString(),
				};

				socketIO.emit(EventTypes.newMessage, message);
			}

			scrollBottom();
		}
	};

	const onTyping = (event: TypingEvent) => {
		if (socketIO) {
			const data: TypingEventData = {
				username: userSession.username || "",
				roomId: chatRoomDetails?.roomId || "",
				event,
			};

			socketIO.emit(EventTypes.typing, data);
		}
	};

	return (
		<div className={styles.conversationContainer}>
			{chatRoomDetails && (
				<>
					<div className={styles.conversationTop}>
						<div>
							<UserImage user={chatRoomDetails} tabIndex={-1} />

							<div className={styles.conversationTopDetails}>
								<div className={styles.conversationTopUsername}>
									{chatRoomDetails.name}
								</div>
								<div className={styles.conversationTopActivity}>
									{typingEvent.event === "typing" &&
									typingEvent.roomId ===
										chatRoomDetails.roomId
										? "Typing..."
										: chatRoomDetails.timestamp}
								</div>
							</div>
						</div>
					</div>

					<div
						className={styles.conversationMain}
						ref={conversationElemRef}
					>
						{conversations.map((conversation, index) => {
							return (
								<ChatBubble
									key={`chat-bubble-${index}`}
									isOwner={
										conversation.username ===
										userSession.username
									}
									content={conversation.content}
									time={conversation.time}
								/>
							);
						})}

						{conversations.length === 0 && (
							<div className={styles.emptyConvo}>
								<div>
									Don't wait for someone to start, just do it
								</div>
							</div>
						)}
					</div>
					<div className={styles.conversationBottom}>
						<ChatInput
							onTyping={onTyping}
							onInput={onInput}
							socketConnected={!!socketIO}
						/>
					</div>
				</>
			)}

			{!chatRoomDetails && (
				<div className={styles.needChat}>
					<h1>Please select a user to start chatting</h1>
				</div>
			)}
		</div>
	);
};

export default Conversation;
