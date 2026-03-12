import { Task } from './models/Task';
import { User } from './models/User';
import sequelize from './lib/db';

async function run() {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB.");
    const tasks = await Task.findAll({
      include: [
        { model: User, as: 'Assigner', attributes: ['id', 'name'] },
        { model: User, as: 'Assignee', attributes: ['id', 'name'] }
      ]
    });
    console.log("Success! Found tasks:", tasks.length);
  } catch (e: any) {
    console.error("Query Error:", e.name, e.message);
    if (e.original) {
      console.error("Original SQL Error:", e.original.message);
    }
  } finally {
    process.exit(0);
  }
}
run();
