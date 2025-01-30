'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Denuncia', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      denunciante_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      denunciante_tipo: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      denunciado_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      titulo: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      conteudo: {
        allowNull: false,
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('Denuncia');
  },
};
