import { DbError } from '../../../errors/DbError';
import { Competition, CompetitionIdObject, CompetitionSiteObject } from '../../../models/competition/competition';
import { CompetitionAccessLevel, CompetitionStaff, CompetitionUserRole } from '../../../models/competition/competitionUser';
import { University } from '../../../models/university/university';
import { Staff } from '../../../models/user/staff/staff';
import { SqlDbCompetitionRepository } from '../../../repository/competition/SqlDbCompetitionRepository';
import { SqlDbCompetitionStaffRepository } from '../../../repository/competition_staff/SqlDbCompetitionStaffRepository';
import { SqlDbCompetitionStudentRepository } from '../../../repository/competition_student/SqlDbCompetitionStudentRepository';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { UserIdObject } from '../../../repository/UserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';

// fail testing failed
describe('Staff Join Function', () => {
  let user_db : SqlDbUserRepository;
  let comp_db : SqlDbCompetitionRepository;
  let comp_staff_db : SqlDbCompetitionStaffRepository;
  let comp_student_db : SqlDbCompetitionStudentRepository;

  let dateNow = Date.now();
  let startDate = Date.now() + (420 * 1000 * 60 * 60 * 24);
  let earlyDate = Date.now() + (365 * 1000 * 60 * 60 * 24);
  let generalDate = Date.now() + (395 * 1000 * 60 * 60 * 24);

  const mockCompetition : Competition = {
    name: 'TestComp',
    teamSize: 5,
    createdDate: dateNow,
    earlyRegDeadline: earlyDate,
    startDate: startDate,
    generalRegDeadline: generalDate,
    siteLocations: [{ universityId: 1, defaultSite: 'Library', universityName: 'University of Melbourne', siteId: 1 }],
    code: 'TC14',
    region: 'Australia'
  };

  const mockStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'dasOddodmin13@odmin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };
  const mockStaff1: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'mockerStaff1@odmin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };
  const mockStaff2: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'mockerStaff2@odmin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };
  const mockStaff3: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'mockerStaff3@odmin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };
  let user: UserIdObject;
  let id: number;
  let mockStaffId1: UserIdObject;
  let mockStaffId2: UserIdObject;
  let mockStaffId3: UserIdObject;
  let comp: CompetitionIdObject;

  beforeAll(async () => {
    comp_db = new SqlDbCompetitionRepository(pool);
    comp_staff_db = new SqlDbCompetitionStaffRepository(pool, comp_db);
    comp_student_db = new SqlDbCompetitionStudentRepository(pool, comp_db);

    user_db = new SqlDbUserRepository(pool);
    user = await user_db.staffRegister(mockStaff);
    id = user.userId;
    comp = await comp_staff_db.competitionSystemAdminCreate(id, mockCompetition);
    mockStaffId1 = await user_db.staffRegister(mockStaff1);
    mockStaffId2 = await user_db.staffRegister(mockStaff2);
    mockStaffId3 = await user_db.staffRegister(mockStaff3);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });
  test('Success case: adds new admin to the competition', async () => {
    const newAdmin: CompetitionStaff = {
      userId: mockStaffId1.userId,
      competitionRoles: [CompetitionUserRole.ADMIN],
      accessLevel: CompetitionAccessLevel.ACCEPTED
    };

    await comp_staff_db.competitionStaffJoin(comp.competitionId, newAdmin);

    expect(await comp_staff_db.competitionStaff(id, comp.competitionId)).toStrictEqual([
      {
        userId: id,
        universityId: 1,
        universityName: 'University of Melbourne',
        name: 'Maximillian Maverick',
        email: 'dasOddodmin13@odmin.com',
        sex: 'Male',
        pronouns: 'He/Him',
        tshirtSize: 'M',
        allergies: null,
        dietaryReqs: '{}',
        accessibilityReqs: null,
        bio: '',
        roles: ['Admin'],
        access: 'Accepted',
        userAccess: 'Pending'
      },
      {
        userId: mockStaffId1.userId,
        universityId: 1,
        universityName: 'University of Melbourne',
        name: 'Maximillian Maverick',
        email: 'mockerStaff1@odmin.com',
        sex: 'Male',
        pronouns: 'He/Him',
        tshirtSize: 'M',
        allergies: null,
        dietaryReqs: '{}',
        accessibilityReqs: null,
        bio: '',
        roles: ['Admin'],
        access: 'Pending',
        userAccess: 'Pending'
      }
    ]);
  });
  test('Success case: adds new coach to the competition', async () => {
    const universityOrigin: University = {
      id: 1,
      name: 'University of Melbourne'
    };
    const userSiteLocation: CompetitionSiteObject = {
      id: 1,
      name: 'the place in the ring',
    };

    const newCoach: CompetitionStaff = {
      userId: mockStaffId2.userId,
      competitionRoles: [CompetitionUserRole.COACH],
      accessLevel: CompetitionAccessLevel.ACCEPTED,
      university: universityOrigin,
      competitionBio: 'i good, trust',
      siteLocation: userSiteLocation
    };

    await comp_staff_db.competitionStaffJoin(comp.competitionId, newCoach);
    expect(await comp_staff_db.competitionStaff(id, comp.competitionId)).toStrictEqual([
      {
        userId: id,
        universityId: 1,
        universityName: 'University of Melbourne',
        name: 'Maximillian Maverick',
        email: 'dasOddodmin13@odmin.com',
        sex: 'Male',
        pronouns: 'He/Him',
        tshirtSize: 'M',
        allergies: null,
        dietaryReqs: '{}',
        accessibilityReqs: null,
        bio: '',
        roles: ['Admin'],
        access: 'Accepted',
        userAccess: 'Pending'
      },
      {
        userId: mockStaffId1.userId,
        universityId: 1,
        universityName: 'University of Melbourne',
        name: 'Maximillian Maverick',
        email: 'mockerStaff1@odmin.com',
        sex: 'Male',
        pronouns: 'He/Him',
        tshirtSize: 'M',
        allergies: null,
        dietaryReqs: '{}',
        accessibilityReqs: null,
        bio: '',
        roles: ['Admin'],
        access: 'Pending',
        userAccess: 'Pending'
      },
      {
        userId: mockStaffId2.userId,
        universityId: 1,
        universityName: 'University of Melbourne',
        name: 'Maximillian Maverick',
        email: 'mockerStaff2@odmin.com',
        sex: 'Male',
        pronouns: 'He/Him',
        tshirtSize: 'M',
        allergies: null,
        dietaryReqs: '{}',
        accessibilityReqs: null,
        bio: 'i good, trust',
        roles: ['Coach'],
        access: 'Pending',
        userAccess: 'Pending'
      }
    ]);
  });
  test('Success case: adds new site coordinator to the competition', async () => {
    const userSiteLocation: CompetitionSiteObject = {
      id: 1,
      name: 'the place in the ring',
    };
    const newCoordinator: CompetitionStaff = {
      userId: mockStaffId3.userId,
      competitionRoles: [CompetitionUserRole.SITE_COORDINATOR],
      accessLevel: CompetitionAccessLevel.ACCEPTED,
      siteLocation: userSiteLocation
    };

    await comp_staff_db.competitionStaffJoin(comp.competitionId, newCoordinator);
    expect(await comp_staff_db.competitionStaff(id, comp.competitionId)).toStrictEqual([
      {
        userId: id,
        universityId: 1,
        universityName: 'University of Melbourne',
        name: 'Maximillian Maverick',
        email: 'dasOddodmin13@odmin.com',
        sex: 'Male',
        pronouns: 'He/Him',
        tshirtSize: 'M',
        allergies: null,
        dietaryReqs: '{}',
        accessibilityReqs: null,
        bio: '',
        roles: ['Admin'],
        access: 'Accepted',
        userAccess: 'Pending'
      },
      {
        userId: mockStaffId1.userId,
        universityId: 1,
        universityName: 'University of Melbourne',
        name: 'Maximillian Maverick',
        email: 'mockerStaff1@odmin.com',
        sex: 'Male',
        pronouns: 'He/Him',
        tshirtSize: 'M',
        allergies: null,
        dietaryReqs: '{}',
        accessibilityReqs: null,
        bio: '',
        roles: ['Admin'],
        access: 'Pending',
        userAccess: 'Pending'
      },
      {
        userId: mockStaffId2.userId,
        universityId: 1,
        universityName: 'University of Melbourne',
        name: 'Maximillian Maverick',
        email: 'mockerStaff2@odmin.com',
        sex: 'Male',
        pronouns: 'He/Him',
        tshirtSize: 'M',
        allergies: null,
        dietaryReqs: '{}',
        accessibilityReqs: null,
        bio: 'i good, trust',
        roles: ['Coach'],
        access: 'Pending',
        userAccess: 'Pending'
      },
      {
        userId: mockStaffId3.userId,
        universityId: 1,
        universityName: 'University of Melbourne',
        name: 'Maximillian Maverick',
        email: 'mockerStaff3@odmin.com',
        sex: 'Male',
        pronouns: 'He/Him',
        tshirtSize: 'M',
        allergies: null,
        dietaryReqs: '{}',
        accessibilityReqs: null,
        bio: '',
        roles: ['Site-Coordinator'],
        access: 'Pending',
        userAccess: 'Pending'
      }
    ]);
  });

  test('Fail case: user is already a admin for the competition', async () => {
    const newAdmin: CompetitionStaff = {
      userId: mockStaffId1.userId,
      competitionRoles: [CompetitionUserRole.ADMIN],
      accessLevel: CompetitionAccessLevel.ACCEPTED
    };

    await expect(
      comp_staff_db.competitionStaffJoin(comp.competitionId, newAdmin)
    ).rejects.toThrow(DbError);
    
  });
  test('Fail case: user is already a coach for the competition', async () => {
    const universityOrigin: University = {
      id: 1,
      name: 'University of Melbourne'
    };
    const userSiteLocation: CompetitionSiteObject = {
      id: 1,
      name: 'the place in the ring',
    };

    const newCoach: CompetitionStaff = {
      userId: mockStaffId2.userId,
      competitionRoles: [CompetitionUserRole.COACH],
      accessLevel: CompetitionAccessLevel.ACCEPTED,
      university: universityOrigin,
      competitionBio: 'i good, trust',
      siteLocation: userSiteLocation
    };

    await expect(
      comp_staff_db.competitionStaffJoin(comp.competitionId, newCoach)
    ).rejects.toThrow(DbError);
  });
  test('Fail case: user is already a site coordinator for the competition', async () => {
    const userSiteLocation: CompetitionSiteObject = {
      id: 1,
      name: 'the place in the ring',
    };
    const newCoordinator: CompetitionStaff = {
      userId: mockStaffId3.userId,
      competitionRoles: [CompetitionUserRole.SITE_COORDINATOR],
      accessLevel: CompetitionAccessLevel.ACCEPTED,
      siteLocation: userSiteLocation
    };

    await expect(
      comp_staff_db.competitionStaffJoin(comp.competitionId, newCoordinator)
    ).rejects.toThrow(DbError);
  });
});