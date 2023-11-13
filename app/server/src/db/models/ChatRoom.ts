import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../config/dbConfig';
import ChatMessage from './ChatMessage';

export interface ChatRoomAttributes {
	roomId: string;
	name: string;
	picture: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export type ChatRoomCreationAttributes = Optional<ChatRoomAttributes, 'roomId'>;

class ChatRoom extends Model<ChatRoomAttributes, ChatRoomCreationAttributes> {
	public roomId!: string;
	public name!: string;
	public picture!: string;
	public createdAt?: Date;
	public updatedAt?: Date;

	public readonly ChatMessages?: ChatMessage[];
}

ChatRoom.init(
	{
		roomId: {
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			type: DataTypes.UUID,
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		picture: {
			allowNull: false,
			type: DataTypes.STRING,
		},
	},
	{
		sequelize,
		modelName: 'ChatRoom',
		tableName: 'chat_rooms',
	}
);

ChatRoom.hasMany(ChatMessage, { foreignKey: 'roomId' });
ChatMessage.belongsTo(ChatRoom, { foreignKey: 'roomId' });

export default ChatRoom;
