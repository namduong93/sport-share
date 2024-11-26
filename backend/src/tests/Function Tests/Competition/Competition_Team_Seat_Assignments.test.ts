import { SiteLocation } from '../../../../shared_types/Competition/CompetitionDetails';
import { CompetitionRole } from '../../../../shared_types/Competition/CompetitionRole';
import { StaffAccess, StaffInfo } from '../../../../shared_types/Competition/staff/StaffInfo';
import { ParticipantTeamDetails } from '../../../../shared_types/Competition/team/TeamDetails';
import { UserAccess } from '../../../../shared_types/User/User';
import { DbError } from '../../../errors/DbError';
import { CompetitionIdObject, CompetitionSiteObject } from '../../../models/competition/competition';
import { CompetitionAccessLevel, CompetitionStaff, CompetitionUser, CompetitionUserRole } from '../../../models/competition/competitionUser';
import { SeatAssignment } from '../../../models/team/team';
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

describe('Staff Register Function', () => {
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
    teamSize: 3,
    createdDate: dateNow,
    earlyRegDeadline: earlyDate,
    startDate: startDate,
    generalRegDeadline: generalDate,
    siteLocations: [userSiteLocation1],
    code: 'TC56',
    region: 'Australia'
  };

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'dasOddodmin56@odmin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };

  const siteCoor: Staff = {
    name: 'Very Example Sute Coor',
    preferredName: 'John Site Coor',
    email: 'johnsitecoor@admin.com',
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
  let siteCoorId: UserIdObject;

  beforeAll(async () => {
    comp_db = new SqlDbCompetitionRepository(pool);
    comp_staff_db = new SqlDbCompetitionStaffRepository(pool, comp_db);
    comp_student_db = new SqlDbCompetitionStudentRepository(pool, comp_db);
    user_db = new SqlDbUserRepository(pool);
    user = await user_db.staffRegister(SucessStaff);
    id = user.userId;
    comp = await comp_staff_db.competitionSystemAdminCreate(id, mockCompetition);

    siteCoorId = await user_db.staffRegister(siteCoor);
    await user_db.staffRequestsUpdate([{
      userId: siteCoorId.userId,
      access: UserAccess.Accepted,
    }]);

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
      userId: siteCoorId.userId,
      competitionRoles: [CompetitionUserRole.SITE_COORDINATOR],
      accessLevel: CompetitionAccessLevel.ACCEPTED,
      competitionBio: 'i good, trust',
      siteLocation: userSiteLocation
    };

    const newCoordinatorInfo: StaffInfo = {
      userId: siteCoorId.userId,
      universityId: 1,
      name: 'Very Example Sute Coor',
      email: 'johnsitecoor@admin.com',
      sex: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'M',
      bio: 'i good, trust',
      allergies: null,
      dietaryReqs: null,
      accessibilityReqs: null,
      userAccess: UserAccess.Accepted,
      roles: [CompetitionRole.SiteCoordinator],
      access: StaffAccess.Accepted,
    };

    await comp_staff_db.competitionStaffJoin(comp.competitionId, newCoach);
    await comp_staff_db.competitionStaffJoin(comp.competitionId, newCoordinator);
    await comp_staff_db.competitionStaffUpdate(id, [newCoordinatorInfo], comp.competitionId);

    const mockStudent: Student = {
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'newStudentSacrifice6@gmail.com',
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

  test('Sucess case: team seats assigned as admin', async () => {
    const teamSeat: SeatAssignment = {
      siteId: '1',
      teamSite: teamInfo.teamSite,
      teamSeat: 'Bongo01',
      teamId: teamId.toString(),
      teamName: teamInfo.teamName,
      teamLevel: 'Level A',
    };

    await comp_staff_db.competitionTeamSeatAssignments(id, comp.competitionId, [teamSeat]);

    const newTeamInfo = await comp_student_db.competitionTeamDetails(newStudent.userId, comp.competitionId);

    expect(newTeamInfo.teamSeat).toStrictEqual('Bongo01');
  });

  test('Sucess case: team seats assigned as site-coordinator', async () => {
    const teamSeat: SeatAssignment = {
      siteId: '1',
      teamSite: teamInfo.teamSite,
      teamSeat: 'Bongo02',
      teamId: teamId.toString(),
      teamName: teamInfo.teamName,
      teamLevel: 'Level A',
    };

    await comp_staff_db.competitionTeamSeatAssignments(siteCoorId.userId, comp.competitionId, [teamSeat]);

    const newTeamInfo = await comp_student_db.competitionTeamDetails(newStudent.userId, comp.competitionId);

    expect(newTeamInfo.teamSeat).toStrictEqual('Bongo02');
  });

  test('Fail cases: non-existing competition or unauthorized', async () => {
    const teamSeat: SeatAssignment = {
      siteId: '1',
      teamSite: teamInfo.teamSite,
      teamSeat: 'Bongo01',
      teamId: teamId.toString(),
      teamName: teamInfo.teamName,
      teamLevel: 'Level A',
    };

    // User not a admin or site-coordinator
    await expect(comp_staff_db.competitionTeamSeatAssignments(999, comp.competitionId, [teamSeat])).rejects.toThrow(DbError);

    // Competition does not exist
    await expect(comp_staff_db.competitionTeamSeatAssignments(id, 999, [teamSeat])).rejects.toThrow(DbError);
  });
});