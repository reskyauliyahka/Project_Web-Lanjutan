const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { User } = require('./userModel');

const Komentar = sequelize.define('Komentar', {
  isi: { type: DataTypes.TEXT, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  karya_id: { type: DataTypes.INTEGER, allowNull: false },
});

Komentar.belongsTo(User, { foreignKey: 'user_id' });

exports.Komentar = Komentar;
