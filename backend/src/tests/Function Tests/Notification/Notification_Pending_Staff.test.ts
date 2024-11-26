import { SiteLocation } from '../../../../shared_types/Competition/CompetitionDetails';
import { UserAccess } from '../../../../shared_types/User/User';
import { DbError } from '../../../errors/DbError';
import { Competition } from '../../../models/competition/competition';
import { CompetitionAccessLevel, CompetitionStaff, CompetitionUserRole } from '../../../models/competition/competitionUser';
import { Staff } from '../../../models/user/staff/staff';
import { SqlDbCompetitionRepository } from '../../../repository/competition/SqlDbCompetitionRepository';
import { SqlDbCompetitionStaffRepository } from '../../../repository/competition_staff/SqlDbCompetitionStaffRepository';
import { SqlDbCompetitionStudentRepository } from '../../../repository/competition_student/SqlDbCompetitionStudentRepository';
import { SqlDbNotificationRepository } from '../../../repository/notification/SqlDbNotificationRepository';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { UserIdObject } from '../../../repository/UserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';

describe('Notification Request Team Name Function', () => {
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
  let staff2: UserIdObject;
  let teamMate1: UserIdObject;

  let compId: number;

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
    code: 'NOTIF11',
    region: 'Australia'
  };

  const staff: Staff = {
    name: 'Very Example Staff',
    preferredName: 'John Staff',
    email: 'johnstaff11@admin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };

  const coach: Staff = {
    name: 'Very Example Coach',
    preferredName: 'John Coach',
    email: 'johncoach@admin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };

  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
    comp_db = new SqlDbCompetitionRepository(pool);
    notif_db = new SqlDbNotificationRepository(pool);
    comp_staff_db = new SqlDbCompetitionStaffRepository(pool, comp_db);
    comp_student_db = new SqlDbCompetitionStudentRepository(pool, comp_db);

    staff1 = await user_db.staffRegister(staff);
    staff2 = await user_db.staffRegister(coach);
    await user_db.staffRequestsUpdate([{
      userId: staff1.userId,
      access: UserAccess.Accepted,
    },
    {
      userId: staff2.userId,
      access: UserAccess.Accepted,
    }]);
    const id = staff1.userId;
    const comp = await comp_staff_db.competitionSystemAdminCreate(id, mockCompetition);

    const newStaffInfo: CompetitionStaff = {
      userId: staff2.userId,
      name: 'Very Example Staff',
      email: 'johnstaff11@admin.com',
      competitionRoles: [CompetitionUserRole.COACH],
      competitionBio: 'I am a coach',
      accessLevel: CompetitionAccessLevel.PENDING,
    };
    await comp_staff_db.competitionStaffJoin(comp.competitionId, newStaffInfo);

    compId = comp.competitionId;
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Success Case', async () => {
    await notif_db.notificationPendingStaffApproval(staff1.userId);
    
    const notifications1 = await notif_db.userNotificationsList(staff1.userId);
    expect(notifications1).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'staffAccount',
          message: expect.stringContaining('New staff account(s) pending approval. Please review in the staff management panel.'),
        }),
      ])
    );

    await notif_db.notificationPendingStaffApproval(staff1.userId);
    const notifications2 = await notif_db.userNotificationsList(staff1.userId);
    expect(notifications2).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'staffAccount',
          message: expect.stringContaining('New staff account(s) pending approval. Please review in the staff management panel.'),
        }),
      ])
    );
  });

  test('Fail Case: User not an admin for any competition', async () => {
    await expect(notif_db.notificationPendingStaffApproval(staff2.userId)).rejects.toThrow(DbError);
  });
});