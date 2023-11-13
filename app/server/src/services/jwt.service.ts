import jwt from 'jsonwebtoken';

/**
 * Generate new JWT
 */
export const createJWT = (userId: number) => {
	return jwt.sign({ userId, iss: 'ChatApp' }, process.env.SECRET_KEY || '', {
		expiresIn: '30d',
	});
};
