import { Express } from 'express';

import { login, register } from '../controllers/auth.controller';
import chatRoutes from './chat.route';
import { kafkaAdmin } from '../controllers/admin.controller';
import validateAuthData from '../middlewares/auth.middleware';

const routes = (app: Express) => {
	// User management
	app.post('/register', validateAuthData, register);
	app.post('/login', validateAuthData, login);

	app.use('/chat', chatRoutes);

	// Admin management
	app.post('/create-topic', kafkaAdmin);

	/** Error handling */
	app.use((req, res) => {
		const error = new Error('Not found');

		res.status(404).json({
			message: error.message,
		});
	});

	return app;
};

export default routes;
