import express from 'express';
import {
	createChatRoom,
	listChatRooms,
	retrieveChatRoom,
} from '../controllers/chat.controller';
import { protectRoute } from '../middlewares/token.middleware';

const router = express.Router();

router.get('/', protectRoute, listChatRooms);
router.post('/', protectRoute, createChatRoom);
router.get('/:id/messages', protectRoute, retrieveChatRoom);

export default router;
