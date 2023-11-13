import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/dbConfig';
import User from './User';
import ChatRoom from './ChatRoom';

export interface UserChatRoomAttributes {
	userId: number;
	roomId: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export type UserChatRoomCreationAttributes = UserChatRoomAttributes;

class UserChatRoom extends Model<
	UserChatRoomAttributes,
	UserChatRoomCreationAttributes
> {
	public userId!: number;
	public roomId!: string;
	public createdAt?: Date;
	public updatedAt?: Date;
}

UserChatRoom.init(
	{
		userId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			references: {
				model: User,
				key: 'id',
			},
		},
		roomId: {
			allowNull: false,
			type: DataTypes.UUID,
			references: {
				model: ChatRoom,
				key: 'roomId',
			},
		},
	},
	{
		sequelize,
		modelName: 'UserChatRoom',
		tableName: 'user_chat_room',
	}
);

ChatRoom.belongsToMany(User, { through: UserChatRoom, foreignKey: 'roomId' });
User.belongsToMany(ChatRoom, { through: UserChatRoom, foreignKey: 'userId' });

export default UserChatRoom;
