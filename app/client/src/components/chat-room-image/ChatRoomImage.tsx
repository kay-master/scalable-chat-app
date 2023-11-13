import React from "react";
import styles from "./ChatRoomImage.module.scss";
import { ChatRoom } from "../../interface/chat.interface";

interface ChatRoomImageProps {
	user: ChatRoom;
	onStartChat?: (chatRoom: ChatRoom) => void;
	tabIndex?: number;
}

const ChatRoomImage = (props: ChatRoomImageProps) => {
	const { user, onStartChat, tabIndex } = props;

	const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();

		if (onStartChat) onStartChat(user);
	};

	return (
		<div
			className={styles.userImageContainer}
			onClick={onClick}
			tabIndex={tabIndex}
		>
			<div className={styles.userImage}>
				<img src={user.picture} alt="Room image" />
			</div>
		</div>
	);
};

export default ChatRoomImage;
