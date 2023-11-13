import { ChatRoom as ChatRoomInterface } from "../../interface/chat.interface";
import ChatRoomImage from "../chat-room-image/ChatRoomImage";
import styles from "./ChatRoom.module.scss";

type ChatRoomProps = {
	chatRoom: ChatRoomInterface;
	isSelected: boolean;
	onChatRoomSelect(): void;
	chatRoomTyping: boolean;
};

const ChatRoom = (props: ChatRoomProps) => {
	const { chatRoom, chatRoomTyping, isSelected, onChatRoomSelect } = props;

	return (
		<button
			className={`${styles.userChatContainer} ${
				isSelected ? styles.userChatActive : ""
			}`}
			onClick={(e) => {
				e.stopPropagation();
				onChatRoomSelect();
			}}
		>
			<div>
				<ChatRoomImage tabIndex={-1} user={chatRoom} />
				<div className={styles.userChatDetails}>
					<div className={styles.username}>{chatRoom.name}</div>
					<div className={styles.time}>
						{chatRoomTyping ? "Typing..." : chatRoom.timestamp}
					</div>
				</div>
			</div>
		</button>
	);
};

export default ChatRoom;
