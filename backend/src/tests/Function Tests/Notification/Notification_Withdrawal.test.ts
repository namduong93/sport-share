import { SiteLocation } from '../../../../shared_types/Competition/CompetitionDetails';
import { CompetitionRole } from '../../../../shared_types/Competition/CompetitionRole';
import { StaffAccess, StaffInfo } from '../../../../shared_types/Competition/staff/StaffInfo';
import { UserAccess } from '../../../../shared_types/User/User';
import { Competition } from '../../../models/competition/competition';
import { CompetitionUser, CompetitionUserRole } from '../../../models/competition/competitionUser';
import { University } from '../../../models/university/university';
import { Staff } from '../../../models/user/staff/staff';
import { Student } from '../../../models/user/student/student';
import { SqlDbCompetitionRepository } from '../../../repository/competition/SqlDbCompetitionRepository';
import { SqlDbCompetitionStaffRepository } from '../../../repository/competition_staff/SqlDbCompetitionStaffRepository';
import { SqlDbCompetitionStudentRepository } from '../../../repository/competition_student/SqlDbCompetitionStudentRepository';
import { SqlDbNotificationRepository } from '../../../repository/notification/SqlDbNotificationRepository';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { UserIdObject } from '../../../repository/UserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';

describe('Notification Withdrawal Function', () => {
  let user_db: SqlDbUserRepository;
  let comp_db: SqlDbCompetitionRepository;
  let notif_db: SqlDbNotificationRepository;
  let comp_staff_db: SqlDbCompetitionStaffRepository;
  let comp_student_db: SqlDbCompetitionStudentRepository;
  
  let dateNow = Date.now();
  let startDate = Date.now() + (420 * 1000 * 60 * 60 * 24);
  let earlyDate = Date.now() + (365 * 1000 * 60 * 60 * 24);
  let generalDate = Date.now() + (395 * 1000 * 60 * 60 * 24);

  let staff1: UserIdObject;
  let teamMate1: UserIdObject;
  let teamMate2: UserIdObject;
  let teamMate3: UserIdObject;

  let compId: number;
  let teamId: number;

  const studentUni1: University = {
    id: 1,
    name: 'University of Melbourne'
  };

  const userSiteLocation1: SiteLocation = {
    universityId: 1,
    universityName: 'University of Melbourne',
    siteId: 1,
    defaultSite: 'Any',
  };

  const mockCompetition: Competition = {
    name: 'TestComp69',
    teamSize: 3,
    createdDate: dateNow,
    earlyRegDeadline: earlyDate,
    startDate: startDate,
    generalRegDeadline: generalDate,
    siteLocations: [userSiteLocation1],
    code: 'NOTIF8',
    region: 'Australia'
  };

  const staff: Staff = {
    name: 'Very Example Staff',
    preferredName: 'John Staff',
    email: 'johnstaff8@admin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };

  const member1: Student = {
    name: 'Test Member 1',
    preferredName: 'X',
    email: 'teamWithdraw1@example.com',
    password: 'password1',
    gender: 'Male',
    pronouns: 'She/Her',
    tshirtSize: 'M',
    universityId: 1,
    studentId: 'z5381413'
  };

  const member2: Student = {
    name: 'Test Member 2',
    preferredName: 'Y',
    email: 'testWithdraw2@example.com',
    password: 'password2',
    gender: 'Female',
    pronouns: 'She/Her',
    tshirtSize: 'M',
    universityId: 2,
    studentId: 'z5381413'
  };

  const member3: Student = {
    name: 'Test Member 3',
    preferredName: 'Z',
    email: 'testWithdraw3@example.com',
    password: 'password3',
    gender: 'Non-binary',
    pronouns: 'They/Them',
    tshirtSize: 'S',
    universityId: 3,
    studentId: 'z5381414'
  };

  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
    comp_db = new SqlDbCompetitionRepository(pool);
    notif_db = new SqlDbNotificationRepository(pool);
    comp_staff_db = new SqlDbCompetitionStaffRepository(pool, comp_db);
    comp_student_db = new SqlDbCompetitionStudentRepository(pool, comp_db);

    staff1 = await user_db.staffRegister(staff);
    const id = staff1.userId;
    const comp = await comp_staff_db.competitionSystemAdminCreate(id, mockCompetition);

    teamMate1 = await user_db.studentRegister(member1);
    teamMate2 = await user_db.studentRegister(member2);
    teamMate3 = await user_db.studentRegister(member3);

    const newStaffInfo: StaffInfo = {
      userId: id,
      universityId: 1,
      universityName: 'University of Melbourne',
      name: 'Very Example Staff',
      email: 'johnstaff8@admin.com',
      sex: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'M',
      allergies: null,
      dietaryReqs: null,
      accessibilityReqs: null,
      userAccess: UserAccess.Accepted,
      bio: 'good bio, trust',
      roles: [CompetitionRole.Admin, CompetitionRole.Coach, CompetitionRole.SiteCoordinator],
      access: StaffAccess.Accepted
    };
    await comp_staff_db.competitionStaffUpdate(id, [newStaffInfo], comp.competitionId);

    const participant1: CompetitionUser = {
      userId: teamMate1.userId,
      competitionId: comp.competitionId,
      competitionRoles: [CompetitionUserRole.PARTICIPANT],
      ICPCEligible: true,
      competitionLevel: 'No Preference',
      siteLocation: {
        id: 1,
        name: 'Any',
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

    const participant2: CompetitionUser = {
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

    const participant3: CompetitionUser = {
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

    await comp_student_db.competitionStudentJoin(participant1, studentUni1);
    await comp_student_db.competitionStudentJoin(participant2, studentUni1);
    await comp_student_db.competitionStudentJoin(participant3, studentUni1);

    const teamCode = await comp_student_db.competitionTeamInviteCode(teamMate1.userId, comp.competitionId);
    await comp_student_db.competitionTeamJoin(teamMate2.userId, comp.competitionId, teamCode, studentUni1);
    await comp_student_db.competitionTeamJoin(teamMate3.userId, comp.competitionId, teamCode, studentUni1);
    
    teamId = comp_db.decrypt(teamCode);
    compId = comp.competitionId;
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Success Case', async () => {
    const teamDetails = await comp_student_db.competitionTeamDetails(teamMate1.userId, compId);

    await notif_db.notificationWithdrawal(teamMate1.userId, compId, mockCompetition.name, teamId, teamDetails.teamName);
    
    const notifications1 = await notif_db.userNotificationsList(staff1.userId);
    expect(notifications1).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'withdrawal',
          message: expect.stringContaining(`${member1.name} has withdrawn from team ${teamDetails.teamName} from competition ${mockCompetition.name}.`),
        }),
      ])
    );

    const notifications2 = await notif_db.userNotificationsList(teamMate2.userId);
    expect(notifications2).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'withdrawal',
          message: expect.stringContaining(`${member1.name} has withdrawn from your team from competition ${mockCompetition.name}.`),
        }),
      ])
    );

    const notifications3 = await notif_db.userNotificationsList(teamMate3.userId);
    expect(notifications3).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'withdrawal',
          message: expect.stringContaining(`${member1.name} has withdrawn from your team from competition ${mockCompetition.name}.`),
        }),
      ])
    );
  });
});