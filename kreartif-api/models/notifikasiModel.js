const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./userModel");
const { Karya } = require("./karyaModel");

const Notifikasi = sequelize.define("Notifikasi", {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  dari_user_id: { type: DataTypes.INTEGER, allowNull: false },
  karya_id: { type: DataTypes.INTEGER, allowNull: false },
  jenis: { type: DataTypes.ENUM("like", "komentar"), allowNull: false },
});

Notifikasi.belongsTo(User, { as: "dari_user", foreignKey: "dari_user_id" });
Notifikasi.belongsTo(Karya, { as: "karya", foreignKey: "karya_id" });

module.exports = { Notifikasi };
