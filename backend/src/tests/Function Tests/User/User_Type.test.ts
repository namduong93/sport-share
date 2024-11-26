import { Student } from '../../../models/user/student/student';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { UserIdObject } from '../../../repository/UserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';


describe('User Type Function', () => {
  let user_db;
  const mockUser: Student = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'Iissleepy@eepy.com',
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

  test('Sucess case: returns user type', async () => {
    expect(await user_db.userType(id)).toStrictEqual({ type: 'student' });
  });
});