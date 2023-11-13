import {
	Kafka,
	Producer,
	Message,
	TopicMessages,
	Consumer,
	// logLevel,
} from 'kafkajs';
import { KafkaTopic, Topic } from '../utils/constants';
import { EventMessage, MessageFormat } from '../interfaces/service.interface';

export class KafkaConfig {
	private producer!: Producer;
	private consumer!: Consumer;

	constructor(actor: 'producer' | 'consumer', groupId?: string) {
		const kafka = new Kafka({
			clientId: actor ? 'chat-producer' : 'chat-consumer',
			brokers: [`${process.env.KAFKA_BROKER}`],
			// logLevel: logLevel.WARN,
		});

		if (actor === 'producer') {
			this.producer = kafka.producer();
			return;
		}

		this.consumer = kafka.consumer({
			groupId: groupId || '',
		});
	}

	/**
	 * Shut down kafka connection
	 */
	private async kill() {
		if (this.producer) await this.producer.disconnect();

		if (this.consumer) await this.consumer.disconnect();
	}

	/**
	 * Start a new kafka connection
	 */
	private async connect() {
		try {
			if (this.producer) await this.producer.connect();

			if (this.consumer) await this.consumer.connect();

			console.log('Successfully connected to Kafka cluster');
		} catch (error) {
			console.error('Error connecting: ', error);
		}
	}

	public async consume(
		topic: Topic,
		callback: (value: EventMessage) => void
	) {
		try {
			await this.connect();

			await this.consumer.subscribe({
				topics: [KafkaTopic[topic]],
				fromBeginning: true,
			});

			await this.consumer.run({
				eachMessage: async (payload) => {
					const { message } = payload;

					callback({
						timestamp: message.timestamp,
						value: message.value ? message.value.toString() : '',
					});
				},
			});

			console.log('Subscribed as consumer topic: ' + KafkaTopic[topic]);
		} catch (error) {
			console.error('Error<consume>: ', error);
		}
	}

	public async produce(
		topic: Topic,
		messages: MessageFormat[]
	): Promise<void> {
		try {
			await this.connect();

			const kafkaMessages: Message[] = messages.map((message) => {
				return {
					value: JSON.stringify(message),
				};
			});

			const topicMessages: TopicMessages = {
				topic: KafkaTopic[topic],
				messages: kafkaMessages,
			};

			await this.producer.send(topicMessages);

			console.log('Produced a message to group: ' + KafkaTopic[topic]);
		} catch (error) {
			console.error('Error<produce>: ', error);
		} finally {
			await this.kill();
		}
	}
}
