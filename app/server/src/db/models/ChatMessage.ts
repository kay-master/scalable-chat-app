import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/dbConfig';

export interface ChatMessageAttributes {
	text: string;
	roomId: string;
	username: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export type ChatMessageCreationAttributes = ChatMessageAttributes;

class ChatMessage extends Model<
	ChatMessageAttributes,
	ChatMessageCreationAttributes
> {
	public text!: string;
	public roomId!: string;
	public username!: string;
	public createdAt?: Date;
	public updatedAt?: Date;
}

ChatMessage.init(
	{
		text: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		roomId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'ChatMessage',
		tableName: 'chat_messages',
	}
);

export default ChatMessage;
