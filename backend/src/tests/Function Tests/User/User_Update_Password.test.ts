import { Student } from '../../../models/user/student/student';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { UserIdObject } from '../../../repository/UserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';


describe('User Update Password Function', () => {
  let user_db;

  const mockUser: Student = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'userUserSacrifice1@OwO.com',
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
    await expect(user_db.userUpdatePassword(user.userId + 1000, 'ezpass', 'newpass')).rejects.toThrow('User not found');
  });
  test('Failed case: old password is wrong', async () => {
    await expect(user_db.userUpdatePassword(user.userId, 'wrongpass', 'newpass')).rejects.toThrow('Current password is incorrect');
  });
  test('Failed case: new password and old is too similar', async () => {
    await expect(user_db.userUpdatePassword(user.userId, 'ezpass', 'ezpass')).rejects.toThrow('New password must be different from old password');
  });
  test('Sucess case: returns a number', async () => {
    await user_db.userUpdatePassword(user.userId, 'ezpass', 'newpass');
    await expect(user_db.userLogin('userUserSacrifice1@OwO.com', 'ezpass')).rejects.toThrow('Incorrect password');
    expect(await user_db.userLogin('userUserSacrifice1@OwO.com', 'newpass')).toEqual({ userId: user.userId });
  });
});