import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

// Handle Next.js ESM / CommonJS import inconsistencies
const SequelizeConstructor = (Sequelize as any).Sequelize || Sequelize;

const sequelize = new SequelizeConstructor(
  process.env.DB_NAME || 'taskmanager',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false,
  }
);

export { sequelize };
export default sequelize;
