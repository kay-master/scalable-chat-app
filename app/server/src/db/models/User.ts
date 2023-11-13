import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../config/dbConfig';

export interface UserAttributes {
	id: number;
	username: string;
	email: string;
	picture: string;
	password: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export type UserCreationAttributes = Optional<UserAttributes, 'id'>;

class User extends Model<UserAttributes, UserCreationAttributes> {
	public id!: number;
	public username!: string;
	public email!: string;
	public password!: string;
	public picture?: string;
	public createdAt?: Date;
	public updatedAt?: Date;
}

User.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		picture: DataTypes.STRING,
	},
	{
		sequelize,
		modelName: 'User',
		tableName: 'users',
	}
);

export default User;
