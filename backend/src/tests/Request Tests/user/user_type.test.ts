// import { UserService } from '../../../services/UserService';
// import { UserType } from '../../../models/user/user';
// import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
// // import pool, { getUserIdFromSessionId } from '../test_util/test_utilities';
// import { SqlDbSessionRepository } from '../../../repository/session/SqlDbSessionRepository';
// import { SessionTokenObject } from '../../../repository/SessionRepository';

describe('GET /user/type', () => {
  // let userService: UserService;

  // beforeAll(async () => {
  //   // Initialize the UserService with real repositories that connect to the test database
  //   userService = new UserService(new SqlDbUserRepository(pool), new SqlDbSessionRepository(pool));
  // });

  // afterAll(() => {
  //   // Clean up and close the database connection
  //   pool.end();
  // });

  // describe('successful cases', () => {
  //   test('admin success', async () => {
  //     const mockAdmin = {
  //       email: 'admin@example.com',
  //       password: 'admin',
  //     };

  //     const sessionToken: SessionTokenObject = await userService.userLogin(mockAdmin.email, mockAdmin.password);
  //     const userId: number = await getUserIdFromSessionId(sessionToken.sessionId);

  //     const result = await userService.userType(userId);

  //     expect(result).toEqual(expect.objectContaining({
  //       type: UserType.SYSTEM_ADMIN,
  //     }));
  //   });

    test('coach success', async () => {
      // const mockStaff = {
      //   email: 'coach@example.com',
      //   password: 'pleasechange',
      // };

      // const sessionToken: SessionTokenObject = await userService.userLogin(mockStaff.email, mockStaff.password);
      // const userId: number = await getUserIdFromSessionId(sessionToken.sessionId);

      // const result = await userService.userType(userId);

      // expect(result).toEqual(expect.objectContaining({
      //   type: UserType.STAFF,
      // }));
    });

  //   test('student success', async () => {
  //     const mockStaff = {
  //       email: 'student@example.com',
  //       password: 'pleasechange',
  //     };

  //     const sessionToken: SessionTokenObject = await userService.userLogin(mockStaff.email, mockStaff.password);
  //     const userId: number = await getUserIdFromSessionId(sessionToken.sessionId);

  //     const result = await userService.userType(userId);

  //     expect(result).toEqual(expect.objectContaining({
  //       type: UserType.STUDENT,
  //     }));
  //   });
  // });

  // describe('failing cases', () => {
  //   test('missing name', async () => {
  //   });
  // })
});
