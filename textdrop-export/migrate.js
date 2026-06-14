const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    console.log('🔄 Connecting to database...');
    console.log('🔄 Creating table pastes...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS pastes (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(20) NOT NULL UNIQUE,
        title VARCHAR(500),
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log('✅ Table pastes created successfully!');

    // Vérification
    const result = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public';
    `);

    console.log('📋 Tables in database:');
    result.rows.forEach(row => console.log('  -', row.table_name));

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

migrate();