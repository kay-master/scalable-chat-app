import { Request, Response } from 'express';
import { Kafka, Admin } from 'kafkajs';

async function shutDown(admin: Admin) {
	await admin.disconnect();

	console.log('Shutting down server!');
}

export const kafkaAdmin = async (req: Request, res: Response) => {
	try {
		const kafka = new Kafka({
			clientId: process.env.KAFKA_CLIENTID,
			brokers: [`${process.env.KAFKA_BROKER}`],
		});

		const admin = kafka.admin();

		console.log('Connecting...');

		await admin.connect();

		console.log('Connected!');

		const created = await admin.createTopics({
			topics: [
				{
					topic: `${process.env.KAFKA_CHAT_TOPIC}`,
					numPartitions: 2,
					replicationFactor: 1,
				},
				{
					topic: `${process.env.KAFKA_EVENTS_TOPIC}`,
					numPartitions: 2,
					replicationFactor: 1,
				},
			],
		});

		if (!created) {
			await shutDown(admin);

			return res.status(500).json({ success: false });
		}

		console.log('Created Successfully!');

		await shutDown(admin);

		res.status(201).json({ success: created });
	} catch (error) {
		res.status(500).json({ success: false, error });
	}
};
