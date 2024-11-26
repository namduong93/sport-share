import { SiteLocation } from '../../../../shared_types/Competition/CompetitionDetails';
import { CompetitionRole } from '../../../../shared_types/Competition/CompetitionRole';
import { StaffAccess, StaffInfo } from '../../../../shared_types/Competition/staff/StaffInfo';
import { UserAccess } from '../../../../shared_types/User/User';
import { DbError } from '../../../errors/DbError';
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

describe('Notification Remove Function', () => {
  let user_db: SqlDbUserRepository;
  let comp_db: SqlDbCompetitionRepository;
  let notif_db: SqlDbNotificationRepository;
  let comp_staff_db: SqlDbCompetitionStaffRepository;
  let comp_student_db: SqlDbCompetitionStudentRepository;
  
  let dateNow = Date.now();
  let startDate = Date.now() + (420 * 1000 * 60 * 60 * 24);
  let earlyDate = Date.now() + (365 * 1000 * 60 * 60 * 24);
  let generalDate = Date.now() + (395 * 1000 * 60 * 60 * 24);

  let teamMate1: UserIdObject;

  let compId: number;
  let teamId: number;

  const studentUni: University = {
    id: 1,
    name: 'University of Melbourne'
  };

  const userSiteLocation: SiteLocation = {
    universityId: 1,
    universityName: 'University of Melbourne',
    siteId: 1,
    defaultSite: 'TestRoom',
  };

  const mockCompetition: Competition = {
    name: 'TestComp2',
    teamSize: 3,
    createdDate: dateNow,
    earlyRegDeadline: earlyDate,
    startDate: startDate,
    generalRegDeadline: generalDate,
    siteLocations: [userSiteLocation],
    code: 'NOTIF4',
    region: 'Australia'
  };

  const staff: Staff = {
    name: 'Very Example Staff',
    preferredName: 'John Staff',
    email: 'johnstaff4@admin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };

  const member1: Student = {
    name: 'Test Member 1',
    preferredName: 'X',
    email: 'teamRemove1@example.com',
    password: 'password1',
    gender: 'Female',
    pronouns: 'She/Her',
    tshirtSize: 'M',
    universityId: 2,
    studentId: 'z5381413'
  };

  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
    comp_db = new SqlDbCompetitionRepository(pool);
    notif_db = new SqlDbNotificationRepository(pool);
    comp_staff_db = new SqlDbCompetitionStaffRepository(pool, comp_db);
    comp_student_db = new SqlDbCompetitionStudentRepository(pool, comp_db);

    const user = await user_db.staffRegister(staff);
    const id = user.userId;
    const comp = await comp_staff_db.competitionSystemAdminCreate(id, mockCompetition);

    const newStaffInfo: StaffInfo = {
      userId: id,
      universityId: 1,
      universityName: 'University of Melbourne',
      name: 'Very Example Staff',
      email: 'johnstaff4@admin.com',
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

    teamMate1 = await user_db.studentRegister(member1);

    const participant1: CompetitionUser = {
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

    await comp_student_db.competitionStudentJoin(participant1, studentUni);

    const teamCode = await comp_student_db.competitionTeamInviteCode(teamMate1.userId, comp.competitionId);

    teamId = comp_db.decrypt(teamCode);
    compId = comp.competitionId;
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Successful Case', async () => {
    // Send the notification
    await notif_db.notificationApproveTeamAssignment(compId, [teamId]);

    const notifications1 = await notif_db.userNotificationsList(teamMate1.userId);
    expect(notifications1).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'teamStatus',
          message: `You have been assigned to a team for competition ${mockCompetition.name}.`,
        }),
      ])
    );

    await notif_db.notificationRemove(notifications1[0].id);
    const notifications2 = await notif_db.userNotificationsList(teamMate1.userId);
    expect(notifications2).toEqual([]);
  });

  test('Fail Case', async () => {
    await expect(notif_db.notificationRemove(999)).rejects.toThrow(DbError);
  });
});