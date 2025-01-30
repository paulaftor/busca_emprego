'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Denuncia extends Model {
    static associate(models) {
    }
  }
  Denuncia.init(
    {
      denunciante_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      denunciante_tipo: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      denunciado_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      titulo: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      conteudo: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Denuncia',
      tableName: 'Denuncia',
    }
  );
  return Denuncia;
};
