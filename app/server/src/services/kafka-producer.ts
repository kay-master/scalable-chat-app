// All kafka producers

import { MessageFormat } from '../interfaces/service.interface';
import { Topic } from '../utils/constants';
import { KafkaConfig } from './kafka-config';

/**
 * Kafka event producer
 */
export async function eventProducer(topic: Topic, eventData: MessageFormat) {
	const kafka = new KafkaConfig('producer');

	await kafka.produce(topic, [eventData]);
}
