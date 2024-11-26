import { Announcement } from '../../../../shared_types/Competition/staff/Announcement';
import { University } from '../../../models/university/university';
import { SqlDbCompetitionRepository } from '../../../repository/competition/SqlDbCompetitionRepository';
import { SqlDbCompetitionStaffRepository } from '../../../repository/competition_staff/SqlDbCompetitionStaffRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';

describe('Competition Announcement Function', () => {
  let comp_db: SqlDbCompetitionRepository;

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
    // Insert a mock announcement for retrieval tests
    await pool.query(`
      INSERT INTO competition_announcements (competition_id, user_id, university_id, message, created_date)
      VALUES ($1, $2, $3, $4, $5)`,
      [mockAnnouncement.competitionId, 1, mockAnnouncement.universityId, mockAnnouncement.message, new Date(mockAnnouncement.createdAt)]
    );
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Retrieve existing announcement', async () => {
    const compId = 1;
    const result = await comp_db.competitionAnnouncement(compId, mockUniversity);

    expect(result).toEqual({
      competitionId: compId,
      message: mockAnnouncement.message,
      createdAt: expect.any(Date),
      universityId: mockUniversity.id
    });
  });

  test('Retrieve non-existing announcement', async () => {
    const compId = 9999; // Assuming this competition ID does not exist
    const result = await comp_db.competitionAnnouncement(compId, mockUniversity);

    expect(result).toBeUndefined();
  });
});
