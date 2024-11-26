import { SqlDbCompetitionRepository } from '../../../repository/competition/SqlDbCompetitionRepository';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { SqlDbCompetitionStaffRepository } from '../../../repository/competition_staff/SqlDbCompetitionStaffRepository';
import { SqlDbCompetitionStudentRepository } from '../../../repository/competition_student/SqlDbCompetitionStudentRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';
import { CompetitionUserRole } from '../../../models/competition/competitionUser';
import { DbError } from '../../../errors/DbError';

describe('Competition Register Teams', () => {
  let comp_db: SqlDbCompetitionRepository;
  let user_db: SqlDbUserRepository;
  let comp_staff_db: SqlDbCompetitionStaffRepository;
  let comp_student_db: SqlDbCompetitionStudentRepository;

  beforeAll(async () => {
    comp_db = new SqlDbCompetitionRepository(pool);
    user_db = new SqlDbUserRepository(pool);
    comp_staff_db = new SqlDbCompetitionStaffRepository(pool, comp_db);
    comp_student_db = new SqlDbCompetitionStudentRepository(pool, comp_db);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failure case: Competition not found', async () => {
    await expect(comp_staff_db.competitionRegisterTeams(3, 999, [5, 6, 7])).rejects.toThrow(DbError);
  });

  test('Failure case: User is not a coach or an admin for this competition', async () => {
    await expect(comp_staff_db.competitionRegisterTeams(999, 4, [5, 6, 7])).rejects.toThrow(DbError);
  });

  test('Fail case: Coach not coaching some of the teams', async () => {
    await expect(comp_staff_db.competitionRegisterTeams(3, 4, [5, 6, 99])).rejects.toThrow(DbError);
  });

  test('Success case', async () => {
    await expect(comp_staff_db.competitionRegisterTeams(3, 4, [5, 6, 7])).resolves.toEqual({});
  });
});