const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { Karya } = require('./karyaModel'); 

const Like = sequelize.define('Like', {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  karya_id: { type: DataTypes.INTEGER, allowNull: false }
});

Like.belongsTo(Karya, { foreignKey: 'karya_id', as: 'karya' });


exports.Like = Like;
