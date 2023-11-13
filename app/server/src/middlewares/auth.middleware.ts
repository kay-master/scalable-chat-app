import { NextFunction, Request, Response } from 'express';

/**
 * Middleware for validating authentication data
 */
const validateAuthData = (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;

	// Validating an email address
	const emailRegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

	if (!email || !email.match(emailRegExp)) {
		return res
			.status(400)
			.json({ success: false, error: 'Invalid email address' });
	}

	if (!password || password.length < 6 || password.length > 30) {
		return res.status(400).json({
			success: false,
			error: 'Password must be between 6 and 30 characters',
		});
	}

	// If email and password are valid, proceed to the controller
	next();
};

export default validateAuthData;
