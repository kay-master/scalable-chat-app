export enum Topic {
	ChatMessages,
	ChatEvents,
}

export const KafkaTopic: Record<Topic, string> = {
	[Topic.ChatEvents]: 'chat-events',
	[Topic.ChatMessages]: 'chat-messages',
};

export const EventTypes = {
	roomCreated: 'room-created',
	joinRoom: 'join-room',
	newMessage: 'new-message',
	broadcastMessage: 'broadcast-message',
	typing: 'typing',
};
