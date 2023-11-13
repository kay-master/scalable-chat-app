import { Request } from 'express';
import User from '../db/models/User';

export interface UserResponseData {
	userId: number;
	username: string;
	email: string;
	picture: string;
}

export interface JWTPayload {
	userId: number;
	iss: string;
	iat: number;
	exp: number;
}

export type ExpressRequest = Request & { user?: typeof User };
