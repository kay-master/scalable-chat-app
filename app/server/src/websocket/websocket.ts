import { TypingEvent } from './../interfaces/service.interface';
import http from 'http';
import { Server } from 'socket.io';
import { EventTypes, Topic } from '../utils/constants';
import { MessageContent } from '../interfaces/service.interface';
import { eventProducer } from '../services/kafka-producer';

/**
 * Websocket server
 */
const socketServer = (httpServer: http.Server) => {
	const io = new Server(httpServer, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
		},
	});

	io.on('connection', (socket) => {
		console.log('New user connected ' + socket.id);

		socket.on(EventTypes.newMessage, async (data: MessageContent) => {
			console.log('New message: ', data);

			await eventProducer(Topic.ChatMessages, {
				event: EventTypes.broadcastMessage,
				data,
			});

			console.log('Event sent to kafka for room: ' + data.roomId);
		});

		socket.on(EventTypes.joinRoom, (data: { roomId: string }) => {
			socket.join(data.roomId);
		});

		socket.on(
			EventTypes.typing,
			(data: { roomId: string; event: TypingEvent }) => {
				io.emit(EventTypes.typing, data);
			}
		);
	});

	io.of('/').adapter.on('create-room', (room) => {
		console.log(`Chat Room: ${room} was created`);
	});

	return io;
};

export default socketServer;
