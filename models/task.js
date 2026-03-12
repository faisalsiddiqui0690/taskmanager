'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Task.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Task.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('pending', 'completed'),
      defaultValue: 'pending'
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High'),
      defaultValue: 'Low'
    },
    dueDate: DataTypes.DATE,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};