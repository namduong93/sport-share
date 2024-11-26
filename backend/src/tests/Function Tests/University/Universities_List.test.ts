import { SqlDbUniversityRepository } from '../../../repository/university/SqlDbUniversityRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';

describe('Universities List Function', () => {
  let user_db;
  beforeAll(async () => {
    user_db = new SqlDbUniversityRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });
  test('Sucess case: returns a number', async () => {
    const result = await user_db.universitiesList();
    expect(result).toStrictEqual({
      universities: [{
        id: 1,
        name: 'University of Melbourne',
      },
      {
        id: 2,
        name: 'Monash University',
      }, {
        id: 3,
        name: 'RMIT University',
      }, {
        id: 4,
        name: 'University of Sydney',
      }, {
        'id': 5,
        'name': 'University of New South Wales',
      }
      ]
    });
  });
});