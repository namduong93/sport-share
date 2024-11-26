import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { SqlDbSessionRepository } from '../../../repository/session/SqlDbSessionRepository';
// import pool from '../test_util/test_utilities';
import { UserService } from '../../../services/UserService';

describe('GET /user/profile_info', () => {
  // let userService: UserService;


  // beforeAll(async () => {
  //   // Initialize the UserService with real repositories that connect to the test database
  //   userService = new UserService(new SqlDbUserRepository(pool), new SqlDbSessionRepository(pool));
  // });

  // afterAll(() => {
  //   // Clean up and close the database connection
  //   pool.end();
  // });

  describe('successful cases', () => {
    test('student success', async () => {
      // const mockLoginDetails = {
      //   email: 'student@example.com',
      //   password: 'pleasechange'
      // };

      // const sessionToken: SessionTokenObject = await userService.userLogin(mockLoginDetails.email, mockLoginDetails.password);
      // const userId: number = await getUserIdFromSessionId(sessionToken.sessionId);

      // // Retrieve user profile info using the userId
      // const result = await userService.userProfileInfo(userId);

      // expect(result).toEqual(expect.objectContaining({
      //   id: 5,
      //   name: 'New User',
      //   preferredName: 'New User',
      //   email: 'student@example.com',
      //   gender: 'M',
      //   pronouns: 'They/them',
      //   tshirtSize: 'S',
      //   allergies: 'None',
      //   dietaryReqs: [],
      //   accessibilityReqs: 'Wheelchair Access',
      //   affiliation: 'University of New South Wales',
      // }));
    });
  });
});
