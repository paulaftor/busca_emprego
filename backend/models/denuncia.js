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
      tipo_denuncia: {
        type: DataTypes.INTEGER,
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
