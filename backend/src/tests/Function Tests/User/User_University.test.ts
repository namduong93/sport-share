import { Student } from '../../../models/user/student/student';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { UserIdObject } from '../../../repository/UserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';


describe('User University Function', () => {
  let user_db;

  const mockUser: Student = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'userUserSacrifice2@OwO.com',
    password: 'ezpass',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'L',
    universityId: 1,
    studentId: 'z5381412'
  };

  let user: UserIdObject;

  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
    user = await user_db.studentRegister(mockUser);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failed case: user does not exist', async () => {
    await expect(user_db.userUniversity(user.userId + 1000)).rejects.toThrow('User not found');
  });
  test('Sucess case: returns a number', async () => {
    expect(await user_db.userUniversity(user.userId)).toStrictEqual({ id: 1, name: 'University of Melbourne' });
  });
});