import React, { useState } from "react";
import styles from "./ChatInput.module.scss";
import { TypingEvent } from "src/interface/chat.interface";

interface ChatInputProps {
	onInput(content: string): void;
	socketConnected: boolean;
	onTyping: (event: TypingEvent) => void;
}

const ChatInput = (props: ChatInputProps) => {
	const { socketConnected, onTyping, onInput } = props;

	const [input, setInput] = useState<string>("");

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (socketConnected && input.trim()) {
			onInput(input.trim());

			setInput("");
			onTyping("stopped");
		}
	};

	const handleTypingStart = () => {
		onTyping("typing");
	};

	const handleTypingStop = () => {
		onTyping("stopped");
	};

	return (
		<form className={styles.chatInputContainer} onSubmit={onSubmit}>
			<input
				value={input}
				onBlur={handleTypingStop}
				onKeyDown={handleTypingStart}
				type="text"
				disabled={!socketConnected}
				placeholder={
					!socketConnected
						? "Trying to reconnect..."
						: "Write a message..."
				}
				onChange={(e) => setInput(e.target.value)}
			/>
			<button type="submit" disabled={!socketConnected || !input}>
				Send
			</button>
		</form>
	);
};

export default ChatInput;
