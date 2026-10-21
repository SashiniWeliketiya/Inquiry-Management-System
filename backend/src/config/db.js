const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:SaRu@1234!!!123@db.wgzxwrdbyvbyexhkagrs.supabase.co:5432/postgres',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};