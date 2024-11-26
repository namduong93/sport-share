import { Pool } from 'pg';
import { SessionRepository } from '../SessionRepository.js';
import { Session } from '../../models/session/session.js';

export class SqlDbSessionRepository implements SessionRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
     * Finds a session by its token.
     *
     * @param {string} tk The session token to search for.
     * @returns {Promise<Session | null>} A promise that resolves to the session object if found, or null if not found.
     */
  async find(tk: string): Promise<Session | null> {
    const sessionQuery = `
          SELECT * FROM sessions
          WHERE session_id = $1;
      `;
    const sessionValues = [tk];
    const sessionResult = await this.pool.query(sessionQuery, sessionValues);
    if (sessionResult.rowCount === 0) {
      return null;
    }
    const session = sessionResult.rows[0];
    return { sessionId: session.session_id, userId: session.user_id, createdAt: session.created_date };
  }

  /**
     * Creates a new session in the database.
     *
     * @param {Session} session The session object containing session details.
     * @returns {Promise<{} | null>} A promise that resolves to an empty object if the session is created successfully, or null if the creation fails.
     */
  async create(session: Session): Promise<{} | null> {
    const sessionQuery = `
          INSERT INTO sessions (session_id, user_id, created_date)
          VALUES ($1, $2, to_timestamp($3))
          RETURNING *;
      `;
    const sessionValues = [session.sessionId, session.userId, session.createdAt];
    const sessionResult = await this.pool.query(sessionQuery, sessionValues);
    if (sessionResult.rowCount === 0) {
      return null;
    }
    // const newSession = sessionResult.rows[0];
    return {};
  }

  /**
     * Deletes a session from the database based on the provided session token.
     *
     * @param {string} tk The session token to identify the session to be deleted.
     * @returns {Promise<boolean>} A promise that resolves to `true` if the session was successfully deleted, 
     *                               or `false` if no session was found with the provided token.
     */
  async delete(tk: string): Promise<boolean> {
    const deleteSessionQuery = `
            DELETE FROM sessions
            WHERE session_id = $1;
        `;
    const deleteSessionValues = [tk];
    const deleteSessionResult = await this.pool.query(deleteSessionQuery, deleteSessionValues);
    if (deleteSessionResult.rowCount === 0) {
      return false;
    }
    return true;
  }
}