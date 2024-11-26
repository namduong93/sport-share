import { Student } from '../../../models/user/student/student';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { UserIdObject } from '../../../repository/UserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';


describe('User Profile Info Function', () => {
  let user_db;
  const mockUser: Student = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'beepbwopmestoopid@dumdum.com',
    password: 'ezpass',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'L',
    universityId: 1,
    studentId: 'z5381412'
  };
  let user: UserIdObject;
  let id: number;

  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
    user = await user_db.studentRegister(mockUser);
    id = user.userId;
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });
  test('Failed case: Unknown Id', async () => {
    await expect(user_db.userProfileInfo(id + 1000)).rejects.toThrow('User not found');
  });
  test('Sucess case: Returns user info', async () => {
    expect(await user_db.userProfileInfo(id)).toStrictEqual({
      id: id,
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'beepbwopmestoopid@dumdum.com',
      affiliation: 'University of Melbourne',
      gender: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'L',
      allergies: null,
      dietaryReqs: '{}',
      accessibilityReqs: null
    });
  });
});