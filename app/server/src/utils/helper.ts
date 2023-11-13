import { MessageFormat } from '../interfaces/service.interface';

export const toLowerCaseTrim = (value: string) => {
	return value.trim().toLowerCase();
};

export const isNumber = (input: string) => {
	return /^\d+$/.test(input);
};

export const validateRoomName = (input: string): string | false => {
	if (isNumber(input)) {
		return false;
	}

	const trimmedInput = input ? input.trim() : '';

	return trimmedInput.length > 0 ? trimmedInput : false;
};

/**
 * Decode input value to JSON object
 * @param value JSON string
 */
export function messageParse(value: string) {
	const message = JSON.parse(value) as MessageFormat;

	return {
		event: message.event,
		data: message.data,
	};
}

/**
 * Create Redis Chat room access KEY, as chatRoom:[roomId]
 */
export function redisAccessKey(roomId: string) {
	return `chatRoom:[${roomId}]`;
}
