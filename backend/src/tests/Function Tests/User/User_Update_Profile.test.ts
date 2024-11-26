import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { UserIdObject } from '../../../repository/UserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';


describe('User Update Profile Function', () => {
  let user_db;

  const mockUser = {
    name: 'beep boop',
    preferredName: 'beep',
    email: 'beepbeepwobwob31@gmail.com',
    password: 'testPassword',
    gender: 'F',
    pronouns: 'He/Him',
    tshirtSize: 'S',
    universityId: 1,
    studentId: 'z1234567'
  };
  const newUserInfo = {
    name: 'beep boop',
    preferredName: 'beepbeep',
    email: 'beepbeepwobwob31@gmail.com',
    password: 'testPassword',
    gender: 'F',
    pronouns: 'She/Him',
    tshirtSize: 'L',
    universityId: 1,
    studentId: 'z1234567'
  };
  let user: UserIdObject;
  let id: number;

  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
    user = await user_db.studentRegister(mockUser);
    // console.log(user)
    id = user.userId;
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Sucess case: successfully changed the info of user', async () => {
    await user_db.userUpdateProfile(id, newUserInfo);
    const newTestUserInfo = {
      name: 'beep boop',
      preferredName: 'beepbeep',
      email: 'beepbeepwobwob31@gmail.com',
      affiliation: 'University of Melbourne',
      gender: 'F',
      pronouns: 'She/Him',
      tshirtSize: 'L',
      allergies: null,
      dietaryReqs:'{}',
      accessibilityReqs: null,
      id: id,
    };
    expect(await user_db.userProfileInfo(id)).toStrictEqual(newTestUserInfo);
  });
});