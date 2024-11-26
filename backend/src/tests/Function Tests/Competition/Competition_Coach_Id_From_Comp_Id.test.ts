import { SiteLocation } from '../../../../shared_types/Competition/CompetitionDetails';
import { CompetitionRole } from '../../../../shared_types/Competition/CompetitionRole';
import { EditCourse } from '../../../../shared_types/Competition/staff/Edit';
import { StaffAccess, StaffInfo } from '../../../../shared_types/Competition/staff/StaffInfo';
import { CourseCategory } from '../../../../shared_types/University/Course';
import { UserAccess } from '../../../../shared_types/User/User';
import { Competition, CompetitionIdObject } from '../../../models/competition/competition';
import { CompetitionUser, CompetitionUserRole } from '../../../models/competition/competitionUser';
import { University } from '../../../models/university/university';
import { Staff } from '../../../models/user/staff/staff';
import { Student } from '../../../models/user/student/student';
import { SqlDbCompetitionRepository } from '../../../repository/competition/SqlDbCompetitionRepository';
import { SqlDbCompetitionStaffRepository } from '../../../repository/competition_staff/SqlDbCompetitionStaffRepository';
import { SqlDbCompetitionStudentRepository } from '../../../repository/competition_student/SqlDbCompetitionStudentRepository';
import { SqlDbUniversityRepository } from '../../../repository/university/SqlDbUniversityRepository';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { UserIdObject } from '../../../repository/UserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';

describe('Coach Id From Comp Id Function', () => {
  let user_db;
  let comp_db;
  let uni_db;
  let comp_staff_db;
  let comp_student_db;

  let dateNow = Date.now();
  let startDate = Date.now() + (420 * 1000 * 60 * 60 * 24);
  let earlyDate = Date.now() + (365 * 1000 * 60 * 60 * 24);
  let generalDate = Date.now() + (395 * 1000 * 60 * 60 * 24);

  const userSiteLocation: SiteLocation = {
    universityId: 1,
    universityName: 'University of Melbourne',
    siteId: 1,
    defaultSite: 'TestRoom',
  };

  const mockCompetition: Competition = {
    name: 'TestComp',
    teamSize: 5,
    createdDate: dateNow,
    earlyRegDeadline: earlyDate,
    startDate: startDate,
    generalRegDeadline: generalDate,
    siteLocations: [userSiteLocation],
    code: 'NEW20',
    region: 'Australia'
  };

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'newadmin20@odmin.com',
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
  let teamInfo;

  beforeAll(async () => {
    comp_db = new SqlDbCompetitionRepository(pool);
    user_db = new SqlDbUserRepository(pool);
    uni_db = new SqlDbUniversityRepository(pool);
    comp_staff_db = new SqlDbCompetitionStaffRepository(pool, comp_db);
    comp_student_db = new SqlDbCompetitionStudentRepository(pool, comp_db);
    user = await user_db.staffRegister(SucessStaff);
    id = user.userId;
    comp = await comp_staff_db.competitionSystemAdminCreate(id, mockCompetition);

    const newStaffInfo: StaffInfo = {
      userId: id,
      universityId: 1,
      universityName: 'University of Melbourne',
      name: 'Maximillian Maverick',
      email: 'newadmin20@odmin.com',
      sex: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'M',
      allergies: null,
      dietaryReqs: '{}',
      accessibilityReqs: null,
      userAccess: UserAccess.Pending,
      bio: 'good bio, trust',
      roles: [CompetitionRole.Admin, CompetitionRole.Coach, CompetitionRole.SiteCoordinator],
      access: StaffAccess.Accepted
    };
    await comp_staff_db.competitionStaffUpdate(id, [newStaffInfo], comp.competitionId);

    const mockStudent: Student = {
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'newcontender20@gmail.com',
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
    teamInfo = await comp_student_db.competitionTeamDetails(newStudent.userId, comp.competitionId);
    const newCourses: EditCourse = {
      [CourseCategory.Introduction]: 'COMP1234',
      [CourseCategory.DataStructures]: 'COMP9999',
      [CourseCategory.AlgorithmDesign]: 'COMP7894',
      [CourseCategory.ProgrammingChallenges]: 'COMP9480',
    };
    await comp_staff_db.competitionStaffUpdateCourses(comp.competitionId, newCourses, 1);
  });


  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Success case: succesfully returns coach ids', async () => {
    expect(await comp_db.competitionCoachIdFromCompId(comp.competitionId, id)).toStrictEqual(expect.any(Number))
  });
  test('Failure case: User is not a coach for this competition.', async () => {
    await expect( comp_db.competitionCoachIdFromCompId(comp.competitionId, id + 1000)).rejects.toThrow("User is not a coach for this competition.")
  });
});