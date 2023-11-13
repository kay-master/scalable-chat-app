const dotenv = require('dotenv');

dotenv.config();

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'chat-db';
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASS = process.env.MYSQL_PASS || 'password';
const MYSQL_PORT = process.env.MYSQL_PORT || 3306;
const MYSQL_DIALECT = process.env.MYSQL_DIALECT || 'mysql';

module.exports = {
	development: {
		username: MYSQL_USER,
		password: MYSQL_PASS,
		database: MYSQL_DATABASE,
		port: MYSQL_PORT,
		host: MYSQL_HOST,
		dialect: MYSQL_DIALECT,
	},
	test: {
		username: MYSQL_USER,
		password: null,
		database: MYSQL_DATABASE,
		host: MYSQL_HOST,
		dialect: MYSQL_DIALECT,
	},
};
