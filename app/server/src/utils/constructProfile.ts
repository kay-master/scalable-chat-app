import User from '../db/models/User';

export const constructChatProfile = (user: User) => {
	return {
		userId: user.id,
		username: user.username,
		picture: user.picture,
		status: 'online',
	};
};
