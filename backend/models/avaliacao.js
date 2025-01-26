'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Avaliacao extends Model {
    static associate(models) {
    }
  }
  Avaliacao.init(
    {
      avaliador_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      avaliador_tipo: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      avaliado_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nota: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pros: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contras: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Avaliacao',
      tableName: 'Avaliacao',
    }
  );
  return Avaliacao;
};
