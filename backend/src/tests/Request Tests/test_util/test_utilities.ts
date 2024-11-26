import { Pool } from 'pg';

// Establish a connection with the test database
const pool = new Pool({
  user: 'postgres',
  password: 'ab',
  host: 'localhost',
  port: 5432, // Test DB port
  database: 'capstone_db',
});

export const getUserIdFromSessionId = async(sessionId: string): Promise<number | null> => {
  const client = await pool.connect();
  let userId: number | null = null;

  try {
    const query = `
      SELECT user_id FROM sessions
      WHERE session_id = $1;
    `;
    const values = [sessionId];

    const result = await client.query(query, values);
    if (result.rowCount !== 0) {
      userId = result.rows[0].user_id;
    }
  } finally {
    client.release();
  }

  return userId;
};

// Code to clean up the database (deleting all records in all tables)
export const deleteAllRecords = async () => {
  const client = await pool.connect();
  try {
    // Disable foreign key checks temporarily
    await client.query('SET session_replication_role = replica;');

    // Get all table names in the public schema
    const result = await client.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public';
    `);

    // Delete from each table
    for (const row of result.rows) {
      const tableName = row.tablename;
      await client.query(`DELETE FROM "${tableName}";`);
    }

    // Enable foreign key checks again
    await client.query('SET session_replication_role = origin;');
  } finally {
    client.release();
  }
};

export default pool;
