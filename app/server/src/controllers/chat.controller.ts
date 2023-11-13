import { Response } from 'express';
import { EventTypes, Topic } from '../utils/constants';
import { ExpressRequest } from '../interfaces/user.interface';
import User from '../db/models/User';
import { validateRoomName } from '../utils/helper';
import ChatRoom from '../db/models/ChatRoom';
import UserChatRoom from '../db/models/UserChatRoom';
import sequelizeConnect from '../config/dbConfig';
import { eventProducer } from '../services/kafka-producer';
import { getRecentChatsByRoomId } from '../services/chat-message.service';

/**
 * Creation of a new chat room
 */
export const createChatRoom = async (req: ExpressRequest, res: Response) => {
	const transaction = await sequelizeConnect.transaction();

	try {
		const { user } = req;
		const { roomName } = req.body;

		const validRoomName = validateRoomName(roomName);

		if (typeof validRoomName === 'boolean') {
			return res.status(400).json({
				success: false,
				error: 'Please enter valid [roomName:string]',
			});
		}

		const roomOwner = user as unknown as User;

		const newRoom = await ChatRoom.create(
			{
				name: validRoomName,
				picture: roomOwner.picture || '',
			},
			{
				transaction,
			}
		);

		// Creating association
		await UserChatRoom.create(
			{
				userId: roomOwner.id,
				roomId: newRoom.roomId,
			},
			{
				transaction,
			}
		);

		const roomDetails = {
			roomId: newRoom.roomId,
			name: newRoom.name,
			picture: newRoom.picture,
			timestamp: newRoom.createdAt?.toISOString(),
		};

		await transaction.commit();

		await eventProducer(Topic.ChatEvents, {
			event: EventTypes.roomCreated,
			data: roomDetails,
		});

		res.status(201).json({
			success: true,
			data: roomDetails,
		});
	} catch (error) {
		await transaction.rollback();

		console.error(error);

		res.status(500).json({
			success: false,
			error: 'Internal server error',
		});
	}
};

/**
 * Listing all available chat rooms
 */
export const listChatRooms = async (req: ExpressRequest, res: Response) => {
	try {
		const findAllRooms = await ChatRoom.findAll({
			order: [['createdAt', 'DESC']],
			attributes: [
				'roomId',
				'name',
				'picture',
				['createdAt', 'timestamp'],
			],
		});

		res.status(200).json({
			success: true,
			data: findAllRooms,
		});
	} catch (error) {
		console.error(error);

		res.status(500).jsonp({
			success: false,
			error: 'Internal server error',
		});
	}
};

/**
 * Retrieve recent chat messages for a specific chat room
 */
export const retrieveChatRoom = async (req: ExpressRequest, res: Response) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				error: 'Chat room [id] is required',
			});
		}

		// Pull recent chats data from redis
		const recentChats = await getRecentChatsByRoomId(id);

		res.status(200).json({
			success: true,
			data: recentChats,
		});
	} catch (error) {
		console.error(error);

		res.status(500).jsonp({
			success: false,
			error: 'Internal server error',
		});
	}
};
