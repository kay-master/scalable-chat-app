import { Sequelize, Dialect } from 'sequelize';

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'chat-db';
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASS = process.env.MYSQL_PASS || 'password';
const MYSQL_PORT = parseInt((process.env.MYSQL_PORT || 3306).toString());
const MYSQL_DIALECT = (process.env.MYSQL_DIALECT || 'mysql') as Dialect;

const sequelizeConnect = new Sequelize({
	port: MYSQL_PORT,
	dialect: MYSQL_DIALECT,
	host: MYSQL_HOST,
	username: MYSQL_USER,
	password: MYSQL_PASS,
	database: MYSQL_DATABASE,
});

export default sequelizeConnect;
