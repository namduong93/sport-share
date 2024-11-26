import { Session } from '../../../models/session/session';
import { Student } from '../../../models/user/student/student';
import { SqlDbSessionRepository } from '../../../repository/session/SqlDbSessionRepository';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { UserIdObject } from '../../../repository/UserRepository';

import pool, { dropTestDatabase } from '../Utils/dbUtils';

describe('Session Create Function', () => {
  let session_db;
  let timeStamp = Date.now();
  let user_db;
  let student: UserIdObject;

  const mockStudent: Student = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'notifSacrifice1@gmail.com',
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
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Success case: a new session is created', async () => {
    const newSession: Session = {
      sessionId: 'ezID',
      createdAt: timeStamp,
      userId: student.userId
    };
    await session_db.create(newSession);
    expect(await session_db.find('ezID')).toMatchObject({
      sessionId: expect.stringMatching(/^ezID\s*$/),  // matches 'ezID' with optional spaces
      userId: expect.any(Number),
      createdAt: expect.any(Date)
    });
  });
});