// Script to clean up duplicate templates and keep only the best ones
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function cleanup() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'launchweb',
    password: process.env.DB_PASSWORD || 'launchweb',
    database: process.env.DB_NAME || 'launchweb',
  });

  try {
    console.log('Cleaning up templates...\n');
    
    // Delete all templates and keep only the new professional ones
    await connection.query('DELETE FROM templates');
    console.log('✓ Cleared all templates');
    
    await connection.end();
    console.log('\nNow run: node backend/database/run-templates.js');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

cleanup();
