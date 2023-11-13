import User from '../db/models/User';
import { createJWT } from './jwt.service';

export const createUserResponse = (user: User) => {
	const { id, username, email, picture } = user;

	// Create json token
	const newJWT = createJWT(id);

	return {
		user: { userId: id, username, email, picture: picture || '' },
		token: newJWT,
	};
};
