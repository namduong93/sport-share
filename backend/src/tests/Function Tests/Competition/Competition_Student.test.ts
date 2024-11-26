import { SiteLocation } from '../../../../shared_types/Competition/CompetitionDetails';
import { CompetitionIdObject, CompetitionSiteObject } from '../../../models/competition/competition';
import { CompetitionAccessLevel, CompetitionStaff, CompetitionUser, CompetitionUserRole } from '../../../models/competition/competitionUser';
import { University } from '../../../models/university/university';
import { Staff } from '../../../models/user/staff/staff';
import { Student } from '../../../models/user/student/student';
import { SqlDbCompetitionRepository } from '../../../repository/competition/SqlDbCompetitionRepository';
import { SqlDbCompetitionStaffRepository } from '../../../repository/competition_staff/SqlDbCompetitionStaffRepository';
import { SqlDbCompetitionStudentRepository } from '../../../repository/competition_student/SqlDbCompetitionStudentRepository';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { UserIdObject } from '../../../repository/UserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';

describe('Competition Student Function', () => {
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
    code: 'TC13',
    region: 'Australia'
  };

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'dasOddodmin12@odmin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };
  let user: UserIdObject;
  let id: number;
  let comp: CompetitionIdObject;
  let newStudent: UserIdObject;

  beforeAll(async () => {
    comp_db = new SqlDbCompetitionRepository(pool);
    comp_staff_db = new SqlDbCompetitionStaffRepository(pool, comp_db);
    comp_student_db = new SqlDbCompetitionStudentRepository(pool, comp_db);
    user_db = new SqlDbUserRepository(pool);
    user = await user_db.staffRegister(SucessStaff);
    id = user.userId;
    comp = await comp_staff_db.competitionSystemAdminCreate(id, mockCompetition);

    const userSiteLocation: CompetitionSiteObject = {
      id: 1,
      name: 'the place in the ring',
    };
    const newCoach: CompetitionStaff = {
      userId: id,
      competitionRoles: [CompetitionUserRole.COACH],
      accessLevel: CompetitionAccessLevel.ACCEPTED,
      university: {
        id: 1,
        name: 'University of Melbourne'
      },
      competitionBio: 'i good, trust',
      siteLocation: userSiteLocation
    };
    const newCoordinator: CompetitionStaff = {
      userId: id,
      competitionRoles: [CompetitionUserRole.SITE_COORDINATOR],
      accessLevel: CompetitionAccessLevel.ACCEPTED,
      siteLocation: userSiteLocation
    };
    await comp_staff_db.competitionStaffJoin(comp.competitionId, newCoach);
    await comp_staff_db.competitionStaffJoin(comp.competitionId, newCoordinator);

    const mockStudent: Student = {
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'newStudentSacrifice4@gmail.com',
      password: 'testPassword',
      gender: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'L',
      universityId: 1,
      studentId: 'z5381412'
    };

    newStudent = await user_db.studentRegister(mockStudent);

    const newContender: CompetitionUser = {
      userId: newStudent.userId,
      competitionId: comp.competitionId,
      competitionRoles: [CompetitionUserRole.PARTICIPANT],
      ICPCEligible: true,
      competitionLevel: 'No Preference',
      siteLocation: {
        id: 1,
        name: 'TestRoom',
      },
      boersenEligible: true,
      degreeYear: 3,
      degree: 'ComSci',
      isRemote: true,
      nationalPrizes: 'none',
      internationalPrizes: 'none',
      codeforcesRating: 7,
      universityCourses: ['4511', '9911', '911'],
      pastRegional: true,
      competitionBio: 'I good, promise',
      preferredContact: 'Pigeon Carrier',
    };
    const studentUni: University = {
      id: 1,
      name: 'University of Melbourne'
    };
    await comp_student_db.competitionStudentJoin(newContender, studentUni);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failure case: user does not have access to this list', async () => {
    expect(await comp_staff_db.competitionStudents(newStudent.userId, comp.competitionId)).toStrictEqual([]);
  });

  test('Sucess case: returns List of students participating in competition', async () => {
    const teamInfo = await comp_student_db.competitionTeamDetails(newStudent.userId, comp.competitionId);
    expect(await comp_staff_db.competitionStudents(id, comp.competitionId)).toStrictEqual([
      {
        userId: newStudent.userId,
        universityId: 1,
        universityName: 'University of Melbourne',
        name: 'Maximillian Maverick',
        preferredName: 'X',
        email: 'newStudentSacrifice4@gmail.com',
        sex: 'Male',
        pronouns: 'He/Him',
        tshirtSize: 'L',
        allergies: null,
        dietaryReqs: '{}',
        accessibilityReqs: null,
        studentId: 'z5381412',
        roles: ['Participant'],
        bio: 'I good, promise',
        ICPCEligible: true,
        boersenEligible: true,
        level: 'No Preference',
        degreeYear: 3,
        degree: 'ComSci',
        isRemote: true,
        isOfficial: null,
        preferredContact: 'Pigeon Carrier',
        nationalPrizes: 'none',
        internationalPrizes: 'none',
        codeforcesRating: 7,
        universityCourses: ['4511', '9911', '911'],
        pastRegional: true,
        status: 'Matched',
        teamName: teamInfo.teamName,
        siteName: 'Library',
        siteId: 1
      }
    ]);
  });
});