const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const password = '123456';

		// Hash the password before storing it in the database
		const hashedPassword = await bcrypt.hash(password, 10);

		await queryInterface.bulkInsert(
			'users',
			[
				{
					email: 'hanisi@gmail.com',
					password: hashedPassword,
					username: 'John Doe',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
