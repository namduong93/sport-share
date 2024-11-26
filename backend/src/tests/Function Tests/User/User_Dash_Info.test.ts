import { Student } from '../../../models/user/student/student';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';

describe('User Dash Info Function', () => {
  let user_db;

  const mockUser: Student = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'anotherEmail@forogt.com',
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

  test('Sucess case: Returns user dash info', async () => {
    const userId = await user_db.studentRegister(mockUser);
    expect(await user_db.userDashInfo(userId.userId)).toStrictEqual({ preferredName: 'X', affiliation: 'University of Melbourne' });
  });
});