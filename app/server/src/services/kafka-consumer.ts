import { Server } from 'socket.io';
import { Topic } from '../utils/constants';
import { KafkaConfig } from './kafka-config';
import { messageParse } from '../utils/helper';
import { MessageContent } from '../interfaces/service.interface';
import { saveChatMessage } from './chat-message.service';

export const eventConsumer = (io: Server) => {
	const kafkaConfig = new KafkaConfig('consumer', 'event-consumer');

	kafkaConfig.consume(Topic.ChatEvents, (event) => {
		const dataEvent = messageParse(event.value);

		console.log('ChatEvents: ', dataEvent);

		io.emit(dataEvent.event, dataEvent.data);
	});
};

export const chatMessageConsumer = (io: Server) => {
	const kafkaConfig = new KafkaConfig('consumer', 'chat-message-consumer');

	kafkaConfig.consume(Topic.ChatMessages, async (event) => {
		const dataEvent = messageParse(event.value);

		// Obtain roomId
		const messageContent = dataEvent.data as MessageContent;

		console.log('ChatMessages: ', dataEvent);

		io.to(messageContent.roomId).emit(dataEvent.event, messageContent);

		await saveChatMessage(messageContent);
	});
};
