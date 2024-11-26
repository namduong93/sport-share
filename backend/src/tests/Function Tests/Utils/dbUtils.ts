// dbUtils.ts
import { Pool } from 'pg';

// connect to postgres
const pool = new Pool({
  // user: 'postgres',
  // host: 'localhost',
  // password: 'Jackofspades948',
  // port: 5432,
  // connectionTimeoutMillis: 20000,
  user: 'postgres',
  password: 'ab',
  host: 'localhost',
  port: 5432, // Test DB port
  database: 'capstone_db',
});

// deletes test database 
export const dropTestDatabase = async (pool: Pool) => {
  await pool.end();
};

export default pool;
