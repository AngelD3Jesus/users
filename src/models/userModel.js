import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/bd.js"; 

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  creationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "cliente",
    validate: {
      isIn: [["cliente", "admin"]],
    },
  },
}, {
  timestamps: false,
  tableName: "users",
});

export default User;