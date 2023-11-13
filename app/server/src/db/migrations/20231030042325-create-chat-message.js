'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('chat_messages', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			text: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			username: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			roomId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: 'chat_rooms',
					key: 'roomId',
				},
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('chat_messages');
	},
};
