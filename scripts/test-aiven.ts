import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env manually
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function testConnection() {
  console.log(`Testing connection using host: ${process.env.DB_HOST}`);
  console.log(`User: ${process.env.DB_USER}, Password: ${process.env.DB_PASSWORD}`);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log('✅ Successfully connected to Aiven MySQL!');
    await connection.end();
  } catch (error: any) {
    console.error('❌ Connection failed:');
    console.error(error.message);
  }
}

testConnection();
