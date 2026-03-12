import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db';
import { User } from './User';

export class Task extends Model {
  // Fields initialized natively via init()
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
      type: DataTypes.ENUM('pending', 'completed'),
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
