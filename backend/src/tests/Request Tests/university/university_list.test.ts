import { SqlDbUniversityRepository } from '../../../repository/university/SqlDbUniversityRepository';
import { UniversityService } from '../../../services/UniversityService';
import pool from '../test_util/test_utilities';

describe('GET universities/list', () => {
  let universityService: UniversityService;

  beforeAll(async () => {
    // Initialize the UniversityService with real repositories that connect to the test database
    universityService = new UniversityService(new SqlDbUniversityRepository(pool));
  });

  afterAll(() => {
    // Clean up and close the database connection
    pool.end();
  });

  describe('successful cases', () => {
    test('success', async () => {
      const mockUniversitiesList = {
        universities: [
          { id: 1, name: 'University of Melbourne' },
          { id: 2, name: 'Monash University' },
          { id: 3, name: 'RMIT University' },
          { id: 4, name: 'University of Sydney' },
          { id: 5, name: 'University of New South Wales' },
        ],
      };

      const result = await universityService.universitiesList();

      expect(result).toEqual(mockUniversitiesList);
    });
  });
});
