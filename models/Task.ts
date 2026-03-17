import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db';
import { User } from './User';

export class Task extends Model {
  declare id: number;
  declare title: string;
  declare description: string | null;
  declare status: 'pending' | 'started' | 'completed';
  declare priority: 'Low' | 'Medium' | 'High';
  declare dueDate: Date | null;
  declare userId: number;
  declare assignedTo: number | null;

  declare readonly Assigner?: { id: number; name: string };
  declare readonly Assignee?: { id: number; name: string };
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('pending', 'started', 'completed'),
      defaultValue: 'pending',
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High'),
      defaultValue: 'Low',
    },
    dueDate: {
      type: DataTypes.DATE,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Task',
    timestamps: true,
  }
);

Task.belongsTo(User, { as: 'Assigner', foreignKey: 'userId' });
Task.belongsTo(User, { as: 'Assignee', foreignKey: 'assignedTo' });
User.hasMany(Task, { as: 'CreatedTasks', foreignKey: 'userId' });
User.hasMany(Task, { as: 'AssignedTasks', foreignKey: 'assignedTo' });
