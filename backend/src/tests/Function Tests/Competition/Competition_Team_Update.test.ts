import { SiteLocation } from '../../../../shared_types/Competition/CompetitionDetails';
import { CompetitionRole } from '../../../../shared_types/Competition/CompetitionRole';
import { EditCourse } from '../../../../shared_types/Competition/staff/Edit';
import { StaffAccess, StaffInfo } from '../../../../shared_types/Competition/staff/StaffInfo';
import { TeamDetails } from '../../../../shared_types/Competition/team/TeamDetails';
import { TeamStatus } from '../../../../shared_types/Competition/team/TeamStatus';
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

describe('Team Update Function', () => {
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
    code: 'NEW13',
    region: 'Australia'
  };

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'newadmin13@odmin.com',
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
  let teamMate1: UserIdObject;
  let teamMate2: UserIdObject;

  beforeAll(async () => {
    comp_db = new SqlDbCompetitionRepository(pool);
    comp_staff_db = new SqlDbCompetitionStaffRepository(pool, comp_db);
    comp_student_db = new SqlDbCompetitionStudentRepository(pool, comp_db);
    user_db = new SqlDbUserRepository(pool);
    uni_db = new SqlDbUniversityRepository(pool);
    user = await user_db.staffRegister(SucessStaff);
    id = user.userId;
    comp = await comp_staff_db.competitionSystemAdminCreate(id, mockCompetition);

    const newStaffInfo: StaffInfo = {
      userId: id,
      universityId: 1,
      universityName: 'University of Melbourne',
      name: 'Maximillian Maverick',
      email: 'newadmin13@odmin.com',
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
      email: 'newcontender13@gmail.com',
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
      email: 'newteammate113@gmail.com',
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
      email: 'newteammate213@gmail.com',
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
    teamInfo = await comp_student_db.competitionTeamDetails(newStudent.userId, comp.competitionId);
    const newCourses: EditCourse = {
      [CourseCategory.Introduction]: 'COMP1234',
      [CourseCategory.DataStructures]: 'COMP9999',
      [CourseCategory.AlgorithmDesign]: 'COMP7894',
      [CourseCategory.ProgrammingChallenges]: 'COMP9480',
    };
    await comp_staff_db.competitionStaffUpdateCourses(comp.competitionId, newCourses, 1);

    const teamCode = await comp_student_db.competitionTeamInviteCode(newStudent.userId, comp.competitionId);
    await comp_student_db.competitionTeamJoin(teamMate1.userId, comp.competitionId, teamCode, studentUni);
    await comp_student_db.competitionTeamJoin(teamMate2.userId, comp.competitionId, teamCode, studentUni);
  });


  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Successful case: Husk', async () => {
    const teamInformation = await comp_staff_db.competitionTeams(id, comp.competitionId);
    // console.log(teamInformation[0].teamId);
    expect(teamInformation).toStrictEqual([
      {
        siteId: 1,
        teamId: expect.any(Number),
        universityId: 1,
        status: 'Pending',
        teamNameApproved: true,
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
            email: 'newcontender13@gmail.com',
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
            'ICPCEligible': true,
            'bio': 'I good, promise',
            'boersenEligible': true,
            'codeforcesRating': 7,
            'email': 'newteammate113@gmail.com',
            'internationalPrizes': 'none',
            'isRemote': true,
            'level': 'No Preference',
            'name': 'Maximillian Maverick',
            'nationalPrizes': 'none',
            'pastRegional': true,
            'preferredContact': 'Pigeon Carrier',
            'preferredName': 'X',
            'sex': 'Male',
            'universityCourses': [
              '4511',
              '9911',
              '911',
            ],
            'userId': teamMate1.userId,
          },
          {
            'ICPCEligible': true,
            'bio': 'I good, promise',
            'boersenEligible': true,
            'codeforcesRating': 7,
            'email': 'newteammate213@gmail.com',
            'internationalPrizes': 'none',
            'isRemote': true,
            'level': 'No Preference',
            'name': 'Maximillian Maverick',
            'nationalPrizes': 'none',
            'pastRegional': true,
            'preferredContact': 'Pigeon Carrier',
            'preferredName': 'X',
            'sex': 'Male',
            'universityCourses': [
              '4511',
              '9911',
              '911',
            ],
            'userId': teamMate2.userId,
          }
        ],
        coach: {
          name: 'Maximillian Maverick',
          email: 'newadmin13@odmin.com',
          bio: 'good bio, trust'
        }
      }
    ]);

    const newTeamInfo: TeamDetails = {
      siteId: 2,
      teamId: teamInformation[0].teamId,
      universityId: 1,
      status: TeamStatus.Pending,
      teamNameApproved: true,
      compName: 'TestComp',
      teamName: 'Cooler Name',
      teamSite: 'Library',
      teamSeat: 'null1',
      teamLevel: 'Level B',
      startDate: new Date(startDate),
      students: [
        {
          userId: newStudent.userId,
          name: 'Maximillian Maverick',
          preferredName: 'X',
          sex: 'Male',
          email: 'newcontender13@gmail.com',
          bio: 'is a lie',
          preferredContact: 'Pigeon Carrier',
          ICPCEligible: false,
          level: 'Level A',
          boersenEligible: false,
          isRemote: false,
          universityCourses: ['4511', '9911', '911'],
          nationalPrizes: 'two',
          internationalPrizes: 'three',
          codeforcesRating: 11,
          pastRegional: false
        },
        {
          'ICPCEligible': true,
          'bio': 'I good, promise',
          'boersenEligible': true,
          'codeforcesRating': 7,
          'email': 'newteammate113@gmail.com',
          'internationalPrizes': 'none',
          'isRemote': true,
          'level': 'No Preference',
          'name': 'Maximillian Maverick',
          'nationalPrizes': 'none',
          'pastRegional': true,
          'preferredContact': 'Pigeon Carrier',
          'preferredName': 'X',
          'sex': 'Male',
          'universityCourses': [
            '4511',
            '9911',
            '911',
          ],
          'userId': teamMate1.userId,
        },
        {
          'ICPCEligible': true,
          'bio': 'I good, promise',
          'boersenEligible': true,
          'codeforcesRating': 7,
          'email': 'newteammate213@gmail.com',
          'internationalPrizes': 'none',
          'isRemote': true,
          'level': 'No Preference',
          'name': 'Maximillian Maverick',
          'nationalPrizes': 'none',
          'pastRegional': true,
          'preferredContact': 'Pigeon Carrier',
          'preferredName': 'X',
          'sex': 'Male',
          'universityCourses': [
            '4511',
            '9911',
            '911',
          ],
          'userId': teamMate2.userId,
        }
      ],
      coach: {
        name: 'Maximillian Maverick',
        email: 'newadmin13@odmin.com',
        bio: 'good bio, trust'
      }
    };

    await comp_staff_db.competitionTeamsUpdate([newTeamInfo], comp.competitionId);

    expect(await comp_staff_db.competitionTeams(id, comp.competitionId)).toStrictEqual([{
      siteId: 2,
      teamId: teamInformation[0].teamId,
      universityId: 1,
      status: TeamStatus.Pending,
      teamNameApproved: true,
      compName: 'TestComp',
      teamName: 'Cooler Name',
      teamSite: 'Computer Science Building',
      teamSeat: 'null1',
      teamLevel: 'Level B',
      startDate: new Date(startDate),
      students: [
        {
          userId: newStudent.userId,
          name: 'Maximillian Maverick',
          preferredName: 'X',
          sex: 'Male',
          email: 'newcontender13@gmail.com',
          bio: 'is a lie',
          preferredContact: 'Pigeon Carrier',
          ICPCEligible: false,
          level: 'Level A',
          boersenEligible: false,
          isRemote: false,
          universityCourses: ['4511', '9911', '911'],
          nationalPrizes: 'two',
          internationalPrizes: 'three',
          codeforcesRating: 11,
          pastRegional: false
        },
        {
          'ICPCEligible': true,
          'bio': 'I good, promise',
          'boersenEligible': true,
          'codeforcesRating': 7,
          'email': 'newteammate113@gmail.com',
          'internationalPrizes': 'none',
          'isRemote': true,
          'level': 'No Preference',
          'name': 'Maximillian Maverick',
          'nationalPrizes': 'none',
          'pastRegional': true,
          'preferredContact': 'Pigeon Carrier',
          'preferredName': 'X',
          'sex': 'Male',
          'universityCourses': [
            '4511',
            '9911',
            '911',
          ],
          'userId': teamMate1.userId,
        },
        {
          'ICPCEligible': true,
          'bio': 'I good, promise',
          'boersenEligible': true,
          'codeforcesRating': 7,
          'email': 'newteammate213@gmail.com',
          'internationalPrizes': 'none',
          'isRemote': true,
          'level': 'No Preference',
          'name': 'Maximillian Maverick',
          'nationalPrizes': 'none',
          'pastRegional': true,
          'preferredContact': 'Pigeon Carrier',
          'preferredName': 'X',
          'sex': 'Male',
          'universityCourses': [
            '4511',
            '9911',
            '911',
          ],
          'userId': teamMate2.userId,
        }
      ],
      coach: {
        name: 'Maximillian Maverick',
        email: 'newadmin13@odmin.com',
        bio: 'good bio, trust'
      }
    }]);
  });
});

