import { toLowerCaseTrim } from '../utils/helper';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../db/models/User';
import randomUserDetails from '../utils/randomUser';
import { createUserResponse } from '../services/auth.service';

/**
 * Account registration
 */
export const register = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const modifiedEmail = toLowerCaseTrim(email);

		// Check if account already exist using email
		const userExists = await User.findOne({
			where: {
				email: modifiedEmail,
			},
		});

		if (userExists) {
			return res.status(409).json({
				success: false,
				error: 'Account with email address already exist',
			});
		}

		const userDetails = await randomUserDetails();

		// Hash the password before storing it in the database
		const hashedPassword = await bcrypt.hash(password, 10);

		await User.create({
			username: userDetails.username,
			email: modifiedEmail,
			password: hashedPassword,
			picture: userDetails.picture,
		});

		res.status(201).json({
			success: true,
			message: 'Successfully registered',
		});
	} catch (error) {
		console.error('Error<register>: ', error);

		res.status(500).json({
			success: false,
			error: 'Internal server error',
		});
	}
};

/**
 * Login authentication
 */
export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		// Find the user by email
		const user = await User.findOne({
			where: {
				email: toLowerCaseTrim(email),
			},
		});

		if (!user) {
			return res
				.status(401)
				.json({ success: false, error: 'Account not found' });
		}

		// Password verification
		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return res
				.status(401)
				.json({ success: false, error: 'Invalid password' });
		}

		// Generate JWT
		const response = createUserResponse(user);

		res.status(200).json({
			success: true,
			data: response,
		});
	} catch (error) {
		console.error('Error<login>: ', error);

		res.status(500).json({
			success: false,
			error: 'Internal server error',
		});
	}
};
