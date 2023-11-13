export interface MessageFormat {
	event: string;
	data: any;
}

export interface EventMessage {
	timestamp: string;
	value: string;
}

export interface ChatProfile {}

export interface MessageContent {
	roomId: string;
	content: string;
	username: string;
	time: string;
}

export type TypingEvent = 'typing' | 'stopped';

export interface TypingEventData {
	username: string;
	roomId: string;
	event: TypingEvent;
}
