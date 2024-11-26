
describe('POST /user/logint', () => {
  describe('successful cases', () => {
    test('login success', async () => {
      // const mockLoginDetails = {
      //   email: 'admin@example.com',
      //   password: 'admin',
      // };

      // // Log the user in
      // const loginResponse = await sendRequest.post('/user/login', mockLoginDetails);
      // expect(loginResponse.status).toBe(200);
    });
  });

  describe('failing cases', () => {
    // test('login with undefined email', async () => {
    //   const mockLoginDetails = {
    //     email: undefined,
    //     password: 'admin',
    //   };

    //   try {
    //     await sendRequest.post('/user/login', mockLoginDetails);
    //   } catch (error: any) {
    //     expect(error.response.status).toBe(400);
    //   }
    // });

    // test('login with empty password', async () => {
    //   const mockLoginDetails = {
    //     email: 'admin@example.com',
    //     password: '',
    //   };

    //   try {
    //     await sendRequest.post('/user/login', mockLoginDetails);
    //   } catch (error: any) {
    //     expect(error.response.status).toBe(400);
    //   }
    // });

    test('login with non-matching credentials', async () => {
      // const mockLoginDetails = {
      //   email: 'admin@example.com',
      //   password: 'wrongPassword',
      // };

      // try {
      //   const response = await sendRequest.post('/user/login', mockLoginDetails);
      // } catch (error: any) {
      //   expect(error.response.status).toBe(401);
      // }
    });
  });
});
