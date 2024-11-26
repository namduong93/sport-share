import { SiteLocation } from '../../../../shared_types/Competition/CompetitionDetails';
import { CompetitionIdObject } from '../../../models/competition/competition';
import { Staff } from '../../../models/user/staff/staff';
import { SqlDbCompetitionRepository } from '../../../repository/competition/SqlDbCompetitionRepository';
import { SqlDbCompetitionStaffRepository } from '../../../repository/competition_staff/SqlDbCompetitionStaffRepository';
import { SqlDbCompetitionStudentRepository } from '../../../repository/competition_student/SqlDbCompetitionStudentRepository';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { UserIdObject } from '../../../repository/UserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';

describe('System Admin Update Function', () => {
  let user_db;
  let comp_db;
  let comp_staff_db;
  let comp_student_db

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
    code: 'TC7',
    region: 'Australia'
  };

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'dasOddodmin6@odmin.com',
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
    expect(comp).toStrictEqual({ competitionId: expect.any(Number) });
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failure case: admin is not creator of competition ', async () => {
    const UpdatedMockCompetition = {
      id: comp.competitionId + 10,
      name: 'TestComp',
      teamSize: 20,
      createdDate: dateNow,
      earlyRegDeadline: earlyDate,
      startDate: startDate,
      generalRegDeadline: generalDate,
      siteLocations: [{ universityId: 1, name: 'TestRoom', capacity: 2000 }],
      code: 'TC7',
      region: 'Australia'
    };

    await expect(comp_staff_db.competitionSystemAdminUpdate(id + 1, UpdatedMockCompetition)).rejects.toThrow('User is not an admin for this competition.');
  });

  test('Failure case: User is not an admin for this competition.', async () => {
    const UpdatedMockCompetition = {
      id: comp.competitionId + 10,
      name: 'TestComp',
      teamSize: 20,
      createdDate: dateNow,
      earlyRegDeadline: earlyDate,
      startDate: startDate,
      generalRegDeadline: generalDate,
      siteLocations: [{ universityId: 1, name: 'TestRoom', capacity: 2000 }],
      code: 'TC7',
      region: 'Australia'
    };

    await expect(comp_staff_db.competitionSystemAdminUpdate(1, UpdatedMockCompetition)).rejects.toThrow('User is not an admin for this competition.');
  });

  test('Success case: Competition is updated ', async () => {
    const UpdatedMockCompetition = {
      id: comp.competitionId,
      name: 'TestComp',
      teamSize: 20,
      createdDate: dateNow,
      earlyRegDeadline: earlyDate,
      startDate: startDate,
      generalRegDeadline: generalDate,
      siteLocations: [newSiteLocation],
      code: 'TC7',
      region: 'Australia'
    };

    const result = await comp_staff_db.competitionSystemAdminUpdate(id, UpdatedMockCompetition);

    await expect(result).toStrictEqual({});
    expect(await comp_db.competitionGetDetails(comp.competitionId)).toStrictEqual({
      id: comp.competitionId,
      name: 'TestComp',
      teamSize: 20,
      information: null,
      createdDate: new Date(dateNow),
      earlyRegDeadline: new Date(earlyDate),
      startDate: new Date(startDate),
      generalRegDeadline: new Date(generalDate),
      siteLocations: [{ universityId: 1, name: 'TestRoom', capacity: 0, id: expect.any(Number) }],
      code: 'TC7',
      region: 'Australia'
    });
  });
});