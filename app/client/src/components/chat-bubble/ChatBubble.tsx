import styles from './ChatBubble.module.scss';

interface ChatBubbleProps {
	isOwner: boolean;
	content: string;
	time: string;
}

const ChatBubble = (props: ChatBubbleProps) => {
	const { isOwner, content, time } = props;

	return (
		<div
			className={`${styles.chatBubbleContainer} ${
				isOwner ? styles.chatOwner : ''
			}`}
		>
			<div className={styles.chatBubble}>
				<div>
					<div className={styles.chatContent}>{content}</div>
					<div className={styles.time}>{time}</div>
				</div>
			</div>
		</div>
	);
};

export default ChatBubble;
