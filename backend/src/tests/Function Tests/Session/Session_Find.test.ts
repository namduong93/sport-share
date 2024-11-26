import { SqlDbSessionRepository } from '../../../repository/session/SqlDbSessionRepository';

import pool, { dropTestDatabase } from '../Utils/dbUtils';
import { UserIdObject } from '../../../repository/UserRepository';
import { Student } from '../../../models/user/student/student';
import { Session } from '../../../models/session/session';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';

describe('Session Find Function', () => {
  let session_db;
  let timeStamp = Date.now();
  let user_db;
  let student: UserIdObject;

  const mockStudent: Student = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'notifSacrifice2@gmail.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'L',
    universityId: 1,
    studentId: 'z5381412'
  };

  beforeAll(async () => {
    session_db = new SqlDbSessionRepository(pool);
    user_db = new SqlDbUserRepository(pool);
    student = await user_db.studentRegister(mockStudent);
    const newSession: Session = {
      sessionId: 'ezID',
      createdAt: timeStamp,
      userId: student.userId
    };
    await session_db.create(newSession);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Success case: returns session details', async () => {
    expect(await session_db.find('ezID')).toStrictEqual({
      sessionId: 'ezID                                ',
      userId: expect.any(Number),
      createdAt: expect.any(Date)
    });
  });
  test('failure case: returns null', async () => {
    expect(await session_db.find('wrongId')).toStrictEqual(null);
  });
});