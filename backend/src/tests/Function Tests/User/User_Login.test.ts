import { Student } from '../../../models/user/student/student';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';


describe('User Login Function', () => {
  let user_db;

  const mockUser: Student = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'OwOwhudis@OwO.com',
    password: 'ezpass',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'L',
    universityId: 1,
    studentId: 'z5381412'
  };

  let user;

  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
    user = await user_db.studentRegister(mockUser);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failed case: Wrong Username', async () => {
    await expect(user_db.userLogin('whatdafuq@gmail.com', 'ezpass')).rejects.toThrow('User with email does not exist');
  });
  test('Failed case: Wrong Password', async () => {
    await expect(user_db.userLogin('OwOwhudis@OwO.com', 'passwordfail')).rejects.toThrow('Incorrect password');
  });
  test('Sucess case: returns a number', async () => {
    const result = await user_db.userLogin('OwOwhudis@OwO.com', 'ezpass');
    expect(result).toEqual({ userId: user.userId });
  });
});