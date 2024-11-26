import { Student } from '../../../models/user/student/student';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';


describe('Student Register Function', () => {
  let user_db;

  const mockStudent: Student = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'maximillianmaxi31@gmail.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'L',
    universityId: 1,
    studentId: 'z5381412'
  };

  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Sucess case: new student user made', async () => {
    const result = await user_db.studentRegister(mockStudent);
    expect(result).toEqual({ userId: expect.any(Number) });

    expect(await user_db.userProfileInfo(result.userId)).toStrictEqual({
      id: result.userId,
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'maximillianmaxi31@gmail.com',
      affiliation: 'University of Melbourne',
      gender: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'L',
      allergies: null,
      dietaryReqs: '{}',
      accessibilityReqs: null
    });
  });
  test('Failed case: Email Taken', async () => {
    await expect(user_db.studentRegister(mockStudent)).rejects.toThrow('Student with this email already exists');
  });
});