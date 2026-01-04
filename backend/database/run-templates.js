// Script to install professional templates
// Run with: node backend/database/run-templates.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function runTemplates() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'launchweb',
    password: process.env.DB_PASSWORD || 'launchweb',
    database: process.env.DB_NAME || 'launchweb',
    multipleStatements: true,
  });

  try {
    console.log('Connected to database');
    
    // Read and execute each template file
    const files = ['templates-v2.sql'];
    
    for (const file of files) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        console.log(`Running ${file}...`);
        const sql = fs.readFileSync(filePath, 'utf8');
        await connection.query(sql);
        console.log(`✓ ${file} completed`);
      } else {
        console.log(`⚠ ${file} not found`);
      }
    }
    
    // Check how many templates we have now
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM templates');
    console.log(`\n✓ Total templates in database: ${rows[0].count}`);
    
    // List all templates
    const [templates] = await connection.query('SELECT id, name, category FROM templates ORDER BY id');
    console.log('\nInstalled templates:');
    templates.forEach(t => console.log(`  ${t.id}. ${t.name} (${t.category})`));
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('\nTemplates already exist. To reinstall, first run:');
      console.log('DELETE FROM templates WHERE name IN ("Saveur", "IronForge", "Nova Digital", "CloudPulse", "Aria Portfolio", "Prestige Estates", "Bright Minds Academy", "Serenity Medical", "Luxe Boutique", "Sterling Law Group");');
    }
  } finally {
    await connection.end();
  }
}

runTemplates();
