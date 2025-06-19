const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.Karya = sequelize.define('Karya', {
  judul: { type: DataTypes.STRING, allowNull: false },
  deskripsi: { type: DataTypes.TEXT, allowNull: false },
  kategori: { type: DataTypes.STRING, allowNull: false },
  file_url: { type: DataTypes.STRING, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false }
});