import { SiteLocation } from '../../../../shared_types/Competition/CompetitionDetails';
import { CompetitionRole } from '../../../../shared_types/Competition/CompetitionRole';
import { EditCourse } from '../../../../shared_types/Competition/staff/Edit';
import { StaffAccess, StaffInfo } from '../../../../shared_types/Competition/staff/StaffInfo';
import { CourseCategory } from '../../../../shared_types/University/Course';
import { UserAccess } from '../../../../shared_types/User/User';
import { CompetitionIdObject } from '../../../models/competition/competition';
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

describe('Template tests', () => {
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

  const mockCompetition = {
    name: 'TestComp',
    teamSize: 5,
    createdDate: dateNow,
    earlyRegDeadline: earlyDate,
    startDate: startDate,
    generalRegDeadline: generalDate,
    siteLocations: [userSiteLocation],
    code: 'NEW16',
    region: 'Australia'
  };

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'newadmin16@odmin.com',
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
  let teamMate1: UserIdObject;
  let teamMate2: UserIdObject;
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
      email: 'newadmin16@odmin.com',
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
      email: 'newcontender16@gmail.com',
      password: 'testPassword',
      gender: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'L',
      universityId: 1,
      studentId: 'z5381412'
    };

    const mockStudent2: Student = {
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'newteammate116@gmail.com',
      password: 'testPassword',
      gender: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'L',
      universityId: 1,
      studentId: 'z5381412'
    };

    const mockStudent3: Student = {
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'newteammate216@gmail.com',
      password: 'testPassword',
      gender: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'L',
      universityId: 1,
      studentId: 'z5381412'
    };

    newStudent = await user_db.studentRegister(mockStudent);
    teamMate1 = await user_db.studentRegister(mockStudent2);
    teamMate2 = await user_db.studentRegister(mockStudent3);

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
    const newContender2: CompetitionUser = {
      userId: teamMate1.userId,
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
    const newContender3: CompetitionUser = {
      userId: teamMate2.userId,
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
    await comp_student_db.competitionStudentJoin(newContender2, studentUni);
    await comp_student_db.competitionStudentJoin(newContender3, studentUni);
    // 
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

  // test('Failure case: Team does not exist or is not part of this competition.', async () => {
  //   const teamCode = await comp_student_db.competitionTeamInviteCode(newStudent.userId, comp.competitionId);
  //   console.log(teamCode)
  //   await expect(comp_student_db.competitionTeamJoin(teamMate1.userId, comp.competitionId, 'teamCode', {
  //     id: 1,
  //     name: 'University of Melbourne'
  //   })).rejects.toThrow("Team does not exist or is not part of this competition.")
  // })
  test('Failure case: User is already part of this team.', async () => {
    const teamCode = await comp_student_db.competitionTeamInviteCode(newStudent.userId, comp.competitionId);
    await expect(comp_student_db.competitionTeamJoin(newStudent.userId, comp.competitionId, teamCode, {
      id: 1,
      name: 'University of Melbourne'
    })).rejects.toThrow('User is already part of this team.');
  });
  test('Success case: student successfully join', async () => {
    const teamCode = await comp_student_db.competitionTeamInviteCode(newStudent.userId, comp.competitionId);
    expect(await comp_student_db.competitionTeamJoin(teamMate1.userId, comp.competitionId, teamCode, {
      id: 1,
      name: 'University of Melbourne'
    })).toStrictEqual({ 'teamName': 'Bulbasaur' });
    expect(await comp_student_db.competitionTeamJoin(teamMate2.userId, comp.competitionId, teamCode, {
      id: 1,
      name: 'University of Melbourne'
    })).toStrictEqual({ 'teamName': 'Bulbasaur' });
    expect(await comp_student_db.competitionTeamDetails(newStudent.userId, comp.competitionId)).toStrictEqual({
      compName: 'TestComp',
      teamName: 'Bulbasaur',
      teamSite: 'Library',
      teamSeat: null,
      teamLevel: 'Level B',
      startDate: new Date(startDate),
      students: [
        {
          userId: newStudent.userId,
          name: 'Maximillian Maverick',
          preferredName: 'X',
          sex: 'Male',
          email: 'newcontender16@gmail.com',
          bio: 'I good, promise',
          preferredContact: 'Pigeon Carrier',
          ICPCEligible: true,
          level: 'No Preference',
          boersenEligible: true,
          isRemote: true,
          universityCourses: ['4511', '9911', '911'],
          nationalPrizes: 'none',
          internationalPrizes: 'none',
          codeforcesRating: 7,
          pastRegional: true
        },
        {
          userId: teamMate1.userId,
          name: 'Maximillian Maverick',
          preferredName: 'X',
          sex: 'Male',
          email: 'newteammate116@gmail.com',
          bio: 'I good, promise',
          preferredContact: 'Pigeon Carrier',
          ICPCEligible: true,
          level: 'No Preference',
          boersenEligible: true,
          isRemote: true,
          universityCourses: ['4511', '9911', '911'],
          nationalPrizes: 'none',
          internationalPrizes: 'none',
          codeforcesRating: 7,
          pastRegional: true
        },
        {
          userId: teamMate2.userId,
          name: 'Maximillian Maverick',
          preferredName: 'X',
          sex: 'Male',
          email: 'newteammate216@gmail.com',
          bio: 'I good, promise',
          preferredContact: 'Pigeon Carrier',
          ICPCEligible: true,
          level: 'No Preference',
          boersenEligible: true,
          isRemote: true,
          universityCourses: ['4511', '9911', '911'],
          nationalPrizes: 'none',
          internationalPrizes: 'none',
          codeforcesRating: 7,
          pastRegional: true
        }
      ],
      coach: {
        name: 'Maximillian Maverick',
        email: 'newadmin16@odmin.com',
        bio: 'good bio, trust'
      },
      src_competition_id: expect.any(Number),
    });
  });

  test('Failure case: Team is already full.', async () => {
    const rejectedTeamate: Student = {
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'newteammate316@gmail.com',
      password: 'testPassword',
      gender: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'L',
      universityId: 1,
      studentId: 'z5381412'
    };
    
    const teamMate3 = await user_db.studentRegister(rejectedTeamate);

    const rejectTeamMate: CompetitionUser = {
      userId: teamMate3.userId,
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
    await comp_student_db.competitionStudentJoin(rejectTeamMate, {
      id: 1,
      name: 'University of Melbourne'
    });
    
    const teamCode = await comp_student_db.competitionTeamInviteCode(newStudent.userId, comp.competitionId);
    await expect(comp_student_db.competitionTeamJoin(teamMate3.userId, comp.competitionId, teamCode, {
      id: 1,
      name: 'University of Melbourne'
    })).rejects.toThrow('Team is already full.');
  });
});