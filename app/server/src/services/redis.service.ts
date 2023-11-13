import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Create redis client
 */
const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT || '6340'),
	},
});

export async function redisConnect() {
	client.on('error', (err) => {
		console.log('Redis Client Error', err);
	});
	client.on('ready', () => console.log('Redis is ready'));

	await client.connect();

	await client.ping();
}

const redisClient = client;

export default redisClient;
