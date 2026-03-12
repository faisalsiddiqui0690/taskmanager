import { sequelize } from '../lib/db';
import { User } from '../models/User';
import { Task } from '../models/Task';

async function syncDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connection established.');

    console.log('Syncing models...');
    // Use { alter: true } to create tables without dropping them
    await sequelize.sync({ alter: true });
    
    console.log('Database synced successfully!');
  } catch (error) {
    console.error('Error syncing database:', error);
  } finally {
    process.exit();
  }
}

syncDatabase();
