import { SqlDbCompetitionRepository } from '../../../repository/competition/SqlDbCompetitionRepository';
import { SqlDbCompetitionStaffRepository } from '../../../repository/competition_staff/SqlDbCompetitionStaffRepository';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';


describe('Competition Algorithm Function', () => {
  let user_db: SqlDbUserRepository;
  let comp_db: SqlDbCompetitionRepository;
  let comp_staff_db: SqlDbCompetitionStaffRepository;

  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
    comp_db = new SqlDbCompetitionRepository(pool);
    comp_staff_db = new SqlDbCompetitionStaffRepository(pool, comp_db);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Sucess case', async () => {
    await expect(comp_staff_db.competitionAlgorithm(4, 3)).resolves.not.toThrow();
  });
});