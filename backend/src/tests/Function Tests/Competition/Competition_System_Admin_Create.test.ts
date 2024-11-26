import { Staff } from '../../../models/user/staff/staff';
import { SqlDbCompetitionRepository } from '../../../repository/competition/SqlDbCompetitionRepository';
import { UserIdObject } from '../../../repository/UserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { CompetitionIdObject } from '../../../models/competition/competition';
import { SqlDbCompetitionStaffRepository } from '../../../repository/competition_staff/SqlDbCompetitionStaffRepository';
import { SqlDbCompetitionStudentRepository } from '../../../repository/competition_student/SqlDbCompetitionStudentRepository';
import { SiteLocation } from '../../../../shared_types/Competition/CompetitionDetails';

describe('System Admin Create Function', () => {
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
    code: 'TC1',
    region: 'Australia'
  };

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'dasOddodmin@odmin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };
  let user: UserIdObject;
  let id: number;

  beforeAll(async () => {
    comp_db = new SqlDbCompetitionRepository(pool);
    comp_staff_db = new SqlDbCompetitionStaffRepository(pool, comp_db);
    comp_student_db = new SqlDbCompetitionStudentRepository(pool, comp_db);
    user_db = new SqlDbUserRepository(pool);
    user = await user_db.staffRegister(SucessStaff);
    id = user.userId;
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Sucess case: returns the users team details', async () => {
    let comp: CompetitionIdObject = await comp_staff_db.competitionSystemAdminCreate(id, mockCompetition);
    expect(comp).toStrictEqual({ competitionId: expect.any(Number) });

    expect(await comp_db.competitionGetDetails(comp.competitionId)).toStrictEqual({
      id: comp.competitionId,
      name: 'TestComp',
      teamSize: 5,
      createdDate: new Date(dateNow),
      earlyRegDeadline: new Date(earlyDate),
      generalRegDeadline: new Date(generalDate),
      startDate: new Date(startDate),
      code: 'TC1',
      information: null,
      region: 'Australia',
      siteLocations: [{
        universityId: 1,
        name: 'TestRoom',
        capacity: 0,
        id: expect.any(Number)
      }]
    });
  });

  test('Failure case: Code in use', async () => {
    await expect(comp_staff_db.competitionSystemAdminCreate(id, mockCompetition)).rejects.toThrow('Competition code is already in use.');
  });
});