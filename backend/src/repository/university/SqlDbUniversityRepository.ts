import { Pool } from 'pg';
import { UniversityListObject } from '../../models/university/university.js';
import { UniversityRepository } from '../UniversityRepository.js';
import { Course } from '../../../shared_types/University/Course.js';
import { DbError } from '../../errors/DbError.js';

export class SqlDbUniversityRepository implements UniversityRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Retrieves a list of courses associated with the university of a given user.
   *
   * @param userId The ID of the user whose university courses are to be retrieved.
   * @returns {Promise<Array<Course>>} A promise that resolves to an array of Course objects, each containing the course ID, course name, and category.
   */
  universityCourses = async (userId: number, code: string): Promise<Array<Course>> => {
    
    const dbResult = await this.pool.query(
      `SELECT 
        c.id AS "courseId",
        c.name AS "courseName",
        category
      FROM courses AS c
      JOIN competitions AS comp ON comp.id = c.competition_id
      JOIN universities AS uni ON uni.id = c.university_id
      JOIN users AS u ON u.university_id = uni.id
      WHERE u.id = $1 AND comp.code = $2;`
    , [userId, code]);

    return dbResult.rows;
  };

  /**
   * Retrieves a list of universities from the database.
   *
   * @returns {Promise<UniversityListObject>} A promise that resolves to an object containing a list of universities.
   * @throws {DbError} If no universities are found in the database.
   */
  universitiesList = async (): Promise<UniversityListObject> => {
    let universityQuery = `
      SELECT * FROM universities;
    `;
    const universityResult = await this.pool.query(universityQuery);

    if (universityResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'No university found');
    }

    const universitiesList: UniversityListObject = {
      universities: universityResult.rows.map((row) => ({
        id: row.id,
        name: row.name,
      })),
    };

    return universitiesList;
  };
}