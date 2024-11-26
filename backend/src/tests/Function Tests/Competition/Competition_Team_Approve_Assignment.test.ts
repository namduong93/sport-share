import { SiteLocation } from '../../../../shared_types/Competition/CompetitionDetails';
import { ParticipantTeamDetails } from '../../../../shared_types/Competition/team/TeamDetails';
import { DbError } from '../../../errors/DbError';
import { CompetitionIdObject, CompetitionSiteObject } from '../../../models/competition/competition';
import { CompetitionAccessLevel, CompetitionStaff, CompetitionUser, CompetitionUserRole } from '../../../models/competition/competitionUser';
import { University } from '../../../models/university/university';
import { Staff } from '../../../models/user/staff/staff';
import { Student } from '../../../models/user/student/student';
import { SqlDbCompetitionRepository } from '../../../repository/competition/SqlDbCompetitionRepository';
import { SqlDbCompetitionStaffRepository } from '../../../repository/competition_staff/SqlDbCompetitionStaffRepository';
import { SqlDbCompetitionStudentRepository } from '../../../repository/competition_student/SqlDbCompetitionStudentRepository';
import { CompetitionRepository } from '../../../repository/CompetitionRepository';
import { CompetitionStaffRepository } from '../../../repository/CompetitionStaffRepository';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { UserIdObject, UserRepository } from '../../../repository/UserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';

describe('Approve Team Name Function', () => {
  let user_db: UserRepository;
  let comp_db: CompetitionRepository;
  let comp_staff_db: CompetitionStaffRepository;
  let comp_student_db: SqlDbCompetitionStudentRepository;

  let dateNow = Date.now();
  let startDate = Date.now() + (420 * 1000 * 60 * 60 * 24);
  let earlyDate = Date.now() + (365 * 1000 * 60 * 60 * 24);
  let generalDate = Date.now() + (395 * 1000 * 60 * 60 * 24);

  const userSiteLocation1: SiteLocation = {
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
    siteLocations: [userSiteLocation1],
    code: 'TC543',
    region: 'Australia'
  };

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'dasOddodmin543@odmin.com',
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
  let teamInfo: ParticipantTeamDetails;
  let teamId: number;

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
      email: 'newStudentSacrifice543@gmail.com',
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
    const teamCode = await comp_student_db.competitionTeamInviteCode(newStudent.userId, comp.competitionId);
    teamId = comp_db.decrypt(teamCode);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Sucess case: team assignment approved', async () => {
    await comp_staff_db.competitionApproveTeamAssignment(id, comp.competitionId, [teamId]);

    expect(await comp_staff_db.competitionTeams(id, comp.competitionId)).toStrictEqual([
      {
        siteId: 1,
        teamId: expect.any(Number),
        universityId: 1,
        status: 'Unregistered',
        teamNameApproved: true,
        compName: 'TestComp',
        teamName: 'Bulbasaur',
        teamSite: 'Library',
        teamSeat: null,
        teamLevel: 'Level B',
        startDate: new Date(startDate),
        students: [{
          'ICPCEligible': true,
          'bio': 'I good, promise',
          'boersenEligible': true,
          'codeforcesRating': 7,
          'email': 'newStudentSacrifice543@gmail.com',
          'internationalPrizes': 'none',
          'isRemote': true,
          'level': 'No Preference',
          'name': 'Maximillian Maverick',
          'preferredName': 'X',
          'sex': 'Male',
          'nationalPrizes': 'none',
          'pastRegional': true,
          'preferredContact': 'Pigeon Carrier',
          'universityCourses': [
            '4511',
            '9911',
            '911',
          ],

          'userId': newStudent.userId,
        }, {
          'ICPCEligible': null,
          'bio': null,
          'boersenEligible': null,
          'codeforcesRating': null,
          'email': null,
          'internationalPrizes': null,
          'isRemote': null,
          'level': null,
          'name': null,
          'nationalPrizes': null,
          'preferredName': null,
          'sex': null,
          'pastRegional': null,
          'preferredContact': null,
          'universityCourses': null,
          'userId': null,
        }, {
          'ICPCEligible': null,
          'bio': null,
          'boersenEligible': null,
          'codeforcesRating': null,
          'email': null,
          'internationalPrizes': null,
          'isRemote': null,
          'level': null,
          'name': null,
          'preferredName': null,
          'sex': null,
          'nationalPrizes': null,
          'pastRegional': null,
          'preferredContact': null,
          'universityCourses': null,
          'userId': null,
        }],
        coach: {
          name: 'Maximillian Maverick',
          email: 'dasOddodmin543@odmin.com',
          bio: 'i good, trust'
        }
      }
    ]);
  });

  test('Fail cases', async () => {
    // No team to approve
    await expect(comp_staff_db.competitionApproveTeamAssignment(id, comp.competitionId, [])).rejects.toThrow(DbError);
    
    // Competition not found
    await expect(comp_staff_db.competitionApproveTeamAssignment(id, 99, [teamId])).rejects.toThrow(DbError);

    // User not a admin or coach
    await expect(comp_staff_db.competitionApproveTeamAssignment(99, comp.competitionId, [teamId])).rejects.toThrow(DbError);
  });
});