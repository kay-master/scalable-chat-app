import dayjs from 'dayjs';
import { redisAccessKey } from '../utils/helper';
import ChatMessage from '../db/models/ChatMessage';
import { MessageContent } from '../interfaces/service.interface';
import redisClient from './redis.service';
import ChatRoom from '../db/models/ChatRoom';

async function appendToRedis(
	roomAccessKey: string,
	messages: MessageContent[],
	timestamp?: number
) {
	const processChats = messages.map(async (msg) => {
		const ts = await redisClient.zAdd(roomAccessKey, {
			score: timestamp || dayjs(msg.time).unix(),
			value: JSON.stringify(msg),
		});

		return ts;
	});

	const ts = await Promise.all(processChats);
	console.log(ts);
}

/**
 * Store chat room message
 */
export const saveChatMessage = async (messageContent: MessageContent) => {
	try {
		await ChatMessage.create({
			text: messageContent.content,
			roomId: messageContent.roomId,
			username: messageContent.username,
		});

		const timestamp = new Date().getTime();

		await appendToRedis(
			redisAccessKey(messageContent.roomId),
			[messageContent],
			timestamp
		);
	} catch (error) {
		console.error(error);
	}
};

/**
 * Pull recent chats data from redis
 */
export const getRecentChatsByRoomId = async (
	roomId: string,
	limit = 50
): Promise<MessageContent[]> => {
	try {
		const roomAccessKey = redisAccessKey(roomId);

		// To retrieve the latest 50 messages:
		const cachedMessages = await redisClient.zRange(roomAccessKey, 0, 49);

		if (cachedMessages.length > 0) {
			console.log('Fetching cache');

			const messages = cachedMessages.map((message) => {
				return JSON.parse(message) as MessageContent;
			});

			return messages;
		}

		// Find the room by roomId and include its associated ChatMessages
		const chatRoom = await ChatRoom.findOne({
			where: { roomId },
			include: [
				{
					model: ChatMessage,
					limit,
					order: [['createdAt', 'DESC']],
					attributes: [
						['text', 'content'],
						'roomId',
						'username',
						['createdAt', 'time'],
					],
				},
			],
		});

		if (!chatRoom) {
			throw new Error('ChatRoom not found');
		}

		// Retrieve the recent chat messages
		const recentChats = (chatRoom.ChatMessages ||
			[]) as unknown as MessageContent[];

		if (recentChats.length > 0) {
			console.log('Creating a new cache');

			await appendToRedis(roomAccessKey, recentChats);
		}

		return recentChats;
	} catch (error) {
		console.error('Error retrieving recent chats:', error);

		return [];
	}
};
