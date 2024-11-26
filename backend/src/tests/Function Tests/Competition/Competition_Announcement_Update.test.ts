
import { Announcement } from '../../../../shared_types/Competition/staff/Announcement';
import { University } from '../../../models/university/university';
import { SqlDbCompetitionRepository } from '../../../repository/competition/SqlDbCompetitionRepository';
import { SqlDbCompetitionStaffRepository } from '../../../repository/competition_staff/SqlDbCompetitionStaffRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';

describe('Competition Announcement Update Function', () => {
  let comp_db: SqlDbCompetitionRepository;
  let comp_staff_db: SqlDbCompetitionStaffRepository;

  const mockUniversity: University = {
    id: 1,
    name: 'University of Melbourne'
  };

  const mockAnnouncement: Announcement = {
    userId: 1,
    competitionId: 1,
    message: 'Test Announcement',
    universityId: 1,
    createdAt: new Date().getTime(),
  };

  beforeAll(async () => {
    comp_db = new SqlDbCompetitionRepository(pool);
    comp_staff_db = new SqlDbCompetitionStaffRepository(pool, comp_db);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Insert new announcement', async () => {
    const compId = 1;
    await comp_staff_db.competitionAnnouncementUpdate(compId, mockUniversity, mockAnnouncement);

    const result = await pool.query(`
      SELECT message, university_id AS "universityId"
      FROM competition_announcements
      WHERE competition_id = $1 AND university_id = $2`,
      [compId, mockUniversity.id]
    );

    expect(result.rows[0]).toEqual({
      message: mockAnnouncement.message,
      universityId: mockUniversity.id
    });
  });

  test('Update existing announcement', async () => {
    const compId = 1;
    const updatedAnnouncement = { ...mockAnnouncement, message: 'Updated Announcement' };
    await comp_staff_db.competitionAnnouncementUpdate(compId, mockUniversity, updatedAnnouncement);

    const result = await pool.query(`
      SELECT message, university_id AS "universityId"
      FROM competition_announcements
      WHERE competition_id = $1 AND university_id = $2`,
      [compId, mockUniversity.id]
    );

    expect(result.rows[0]).toEqual({
      message: updatedAnnouncement.message,
      universityId: mockUniversity.id
    });
  });
});