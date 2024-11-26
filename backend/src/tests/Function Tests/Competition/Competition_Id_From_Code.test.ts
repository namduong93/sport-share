import { SiteLocation } from '../../../../shared_types/Competition/CompetitionDetails';
import { CompetitionIdObject } from '../../../models/competition/competition';
import { Staff } from '../../../models/user/staff/staff';
import { SqlDbCompetitionRepository } from '../../../repository/competition/SqlDbCompetitionRepository';
import { SqlDbCompetitionStaffRepository } from '../../../repository/competition_staff/SqlDbCompetitionStaffRepository';
import { SqlDbCompetitionStudentRepository } from '../../../repository/competition_student/SqlDbCompetitionStudentRepository';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { UserIdObject } from '../../../repository/UserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';

describe('Get Comp Id from Code Function', () => {
  let user_db;
  let comp_db;
  let comp_staff_db;
  let comp_student_db;

  let dateNow = Date.now();
  let startDate = Date.now() + (420 * 1000 * 60 * 60 * 24);
  let earlyDate = Date.now() + (365 * 1000 * 60 * 60 * 24);
  let generalDate = Date.now() + (395 * 1000 * 60 * 60 * 24);

  const newSiteLocation: SiteLocation = {
    universityId: 1,
    universityName: 'University of Melbourne',
    defaultSite: 'TestRoom'
  }

  const mockCompetition = {
    name: 'TestComp',
    teamSize: 5,
    createdDate: dateNow,
    earlyRegDeadline: earlyDate,
    startDate: startDate,
    generalRegDeadline: generalDate,
    siteLocations: [newSiteLocation],
    code: 'TC3',
    region: 'Australia'
  };

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'dasOddodmin2@odmin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };
  let user: UserIdObject;
  let id: number;
  let comp: CompetitionIdObject;

  beforeAll(async () => {
    comp_db = new SqlDbCompetitionRepository(pool);
    comp_staff_db = new SqlDbCompetitionStaffRepository(pool, comp_db);
    comp_student_db = new SqlDbCompetitionStudentRepository(pool, comp_db);
    user_db = new SqlDbUserRepository(pool);
    user = await user_db.staffRegister(SucessStaff);
    id = user.userId;
    comp = await comp_staff_db.competitionSystemAdminCreate(id, mockCompetition);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failure case: code does not exist', async () => {
    await expect(comp_db.competitionIdFromCode('ASJDKJHABNDKW')).rejects.toThrow('Competition not found.');
  });

  test('Sucess case: returns the users team details', async () => {
    const result = await comp_db.competitionIdFromCode('TC3');
    expect(result).toBe(comp.competitionId);
  });
});