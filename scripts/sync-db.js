const { sequelize } = require('../lib/db');
const User = require('../models/User');
const Task = require('../models/Task');

async function syncDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connection established.');

    console.log('Syncing models...');
    // Use { alter: true } instead of { force: true } to avoid dropping existing data
    await sequelize.sync({ alter: true });
    
    console.log('Database synced successfully!');
  } catch (error) {
    console.error('Error syncing database:', error);
  } finally {
    process.exit();
  }
}

syncDatabase();
