import { SiteLocation } from '../../../../shared_types/Competition/CompetitionDetails';
import { CompetitionRole } from '../../../../shared_types/Competition/CompetitionRole';
import { EditCourse } from '../../../../shared_types/Competition/staff/Edit';
import { StaffAccess, StaffInfo } from '../../../../shared_types/Competition/staff/StaffInfo';
import { CourseCategory } from '../../../../shared_types/University/Course';
import { UserAccess } from '../../../../shared_types/User/User';
import { CompetitionIdObject } from '../../../models/competition/competition';
import { Staff } from '../../../models/user/staff/staff';
import { SqlDbCompetitionRepository } from '../../../repository/competition/SqlDbCompetitionRepository';
import { SqlDbCompetitionStaffRepository } from '../../../repository/competition_staff/SqlDbCompetitionStaffRepository';
import { SqlDbCompetitionStudentRepository } from '../../../repository/competition_student/SqlDbCompetitionStudentRepository';
import { SqlDbUniversityRepository } from '../../../repository/university/SqlDbUniversityRepository';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { UserIdObject } from '../../../repository/UserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';

// Note! competition staff update does not use User id, user access to this function has not been implemented?

// Note! function needs staff info to work, but staff info supplies useless information aswell.

// Note! If there are multiple id of the staff in the same competition, then the function will return an error. problem arise when a person apply to be a staff of a competition seperately as different roles.

// Suggestion: make new type specifically for staff update. which only needs Bio, User id, roles, and access level
describe('Staff Update Function', () => {
  let user_db;
  let comp_db;
  let comp_staff_db;
  let comp_student_db;
  let uni_db;

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

  const mockCompetition = {
    name: 'TestComp',
    teamSize: 5,
    createdDate: dateNow,
    earlyRegDeadline: earlyDate,
    startDate: startDate,
    generalRegDeadline: generalDate,
    siteLocations: [userSiteLocation],
    code: 'NEW10',
    region: 'Australia'
  };

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'newadmin10@odmin.com',
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
    uni_db = new SqlDbUniversityRepository(pool);
    user = await user_db.staffRegister(SucessStaff);
    id = user.userId;
    comp = await comp_staff_db.competitionSystemAdminCreate(id, mockCompetition);

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

  test('Success case: updates the information of Staff', async () => {
    expect(await comp_staff_db.competitionStaff(id, comp.competitionId)).toStrictEqual([{
      userId: id,
      universityId: 1,
      universityName: 'University of Melbourne',
      name: 'Maximillian Maverick',
      email: 'newadmin10@odmin.com',
      sex: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'M',
      allergies: null,
      dietaryReqs: '{}',
      accessibilityReqs: null,
      userAccess: UserAccess.Pending,
      bio: '',
      roles: [CompetitionRole.Admin],
      access: StaffAccess.Accepted
    }]);
    const newStaffInfo: StaffInfo = {
      userId: id,
      universityId: 1,
      universityName: 'University of Melbourne',
      name: 'Maximillian Maverick',
      email: 'newadmin10@odmin.com',
      sex: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'M',
      allergies: null,
      dietaryReqs: '{}',
      accessibilityReqs: null,
      userAccess: UserAccess.Pending,
      bio: 'This is changed',
      roles: [CompetitionRole.Admin, CompetitionRole.Coach],
      access: StaffAccess.Accepted
    };
    await comp_staff_db.competitionStaffUpdate(id, [newStaffInfo], comp.competitionId);
    expect(await comp_staff_db.competitionStaff(id, comp.competitionId)).toStrictEqual([{
      userId: id,
      universityId: 1,
      universityName: 'University of Melbourne',
      name: 'Maximillian Maverick',
      email: 'newadmin10@odmin.com',
      sex: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'M',
      allergies: null,
      dietaryReqs: '{}',
      accessibilityReqs: null,
      userAccess: UserAccess.Pending,
      bio: 'This is changed',
      roles: [CompetitionRole.Admin, CompetitionRole.Coach],
      access: StaffAccess.Accepted
    }]);
  });
});