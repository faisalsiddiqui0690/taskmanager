import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db';

export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: 'super_admin' | 'admin' | 'employee';
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'admin', 'employee'),
      allowNull: false,
      defaultValue: 'employee',
    },
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: true,
  }
);
