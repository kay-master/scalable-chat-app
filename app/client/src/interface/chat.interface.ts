export interface ChatRoom {
	roomId: string;
	name: string;
	picture: string;
	timestamp: string;
}

export interface MessageContent {
	roomId: string;
	content: string;
	username: string;
	time: string;
}

export type TypingEvent = "typing" | "stopped";

export interface TypingEventData {
	username: string;
	roomId: string;
	event: TypingEvent;
}
