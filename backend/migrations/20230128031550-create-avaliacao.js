'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Avaliacao', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      avaliador_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      avaliador_tipo: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      avaliado_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      nota: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      pros: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      contras: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.dropTable('Avaliacao');
  },
};
