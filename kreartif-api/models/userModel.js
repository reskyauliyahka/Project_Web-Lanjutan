const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
  profile_picture: { type: DataTypes.STRING, allowNull: true }
});
