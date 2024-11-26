import { Staff } from '../../../models/user/staff/staff';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';

describe('Staff Register Function', () => {
  let user_db;

  const mockStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'beepboopmeupscotty@gmail.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };

  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);

  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });
  test('Sucess case: makes a new staff user', async () => {
    const result = await user_db.staffRegister(mockStaff);
    expect(result).toEqual({ userId: expect.any(Number) });
    expect(await user_db.userProfileInfo(result.userId)).toStrictEqual({
      id: result.userId,
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'beepboopmeupscotty@gmail.com',
      affiliation: 'University of Melbourne',
      gender: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'M',
      allergies: null,
      dietaryReqs: '{}',
      accessibilityReqs: null
    });
  });
  test('Failed case: Email Taken', async () => {
    await expect(user_db.staffRegister(mockStaff)).rejects.toThrow('Staff with this email already exists');
  });
});