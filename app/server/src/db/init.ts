import ChatMessage from './models/ChatMessage';
import ChatRoom from './models/ChatRoom';
import User from './models/User';
import UserChatRoom from './models/UserChatRoom';
const isDev = process.env.NODE_ENV === 'development';

const dbInit = () => {
	User.sync({ alter: isDev });
	ChatMessage.sync({ alter: isDev });
	ChatRoom.sync({ alter: isDev });
	UserChatRoom.sync({ alter: isDev });
};

export default dbInit;
