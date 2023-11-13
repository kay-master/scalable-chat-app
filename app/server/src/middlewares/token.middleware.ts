import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../db/models/User';
import { JWTPayload } from '../interfaces/user.interface';

// Middleware for protecting routes and validating JWT
export const protectRoute = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Get the "Authorization" header
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res
			.status(401)
			.json({ success: false, error: 'No token provided' });
	}

	// Split the header to get the token
	const tokenParts = authHeader.split(' ');

	if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
		return res
			.status(401)
			.json({ success: false, error: 'Invalid token format' });
	}

	// Verify the token
	const token = tokenParts[1];

	// Verify the token
	jwt.verify(token, process.env.SECRET_KEY || '', async (err, decoded) => {
		if (err) {
			console.error('Error<verify-jwt>', err);

			return res.status(401).json({
				success: false,
				error: 'Failed to authenticate token',
			});
		}

		const jwtPayload = decoded as JWTPayload;

		// Token is valid; attach the user model to the request
		const user = await User.findOne({
			where: {
				id: jwtPayload.userId,
			},
		});

		if (!user) {
			return res
				.status(401)
				.json({ success: false, error: 'Account not found' });
		}

		// Passing User model to req body
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		req.user = user;

		next();
	});
};
