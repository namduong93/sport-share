
describe('POST /student/register', () => {
  describe('successful cases', () => {
    test('successfully registers a student', async () => {
      // const mockStudent = {
      //   name: 'Quan Hoang',
      //   preferredName: 'Quan',
      //   email: 'hoangtungquan@gmail.com',
      //   password: 'testPassword',
      //   gender: 'Male',
      //   pronouns: 'He/Him',
      //   tshirtSize: 'M',
      //   universityId: 1,
      //   studentId: 'z5296486'
      // };

      // const response = await sendRequest.post('/student/register', mockStudent);
      // expect(response.status).toBe(200);
      // expect(response.data).toEqual({});
    });
  });

  describe('failing cases', () => {
    // test('fails due to missing name', async () => {
    //   const mockStudent = {
    //     name: '',
    //     preferredName: 'Quan',
    //     email: 'hoangtungquan1@gmail.com',
    //     password: 'testPassword',
    //     gender: 'Male',
    //     pronouns: 'He/Him',
    //     tshirtSize: 'M',
    //     universityId: 1,
    //     studentId: 'z5296486'
    //   };

    //   try {
    //     await sendRequest.post('/student/register', mockStudent);
    //   } catch (error: any) {
    //     expect(error.response.status).toBe(400);
    //   }
    // });

    test('fails due to duplicated email', async () => {
      // const mockStudent1 = {
      //   name: 'Quan Hoang',
      //   preferredName: 'Quan',
      //   email: 'hoangtungquan4@gmail.com',
      //   password: 'testPassword',
      //   gender: 'Male',
      //   pronouns: 'He/Him',
      //   tshirtSize: 'M',
      //   universityId: 1,
      //   studentId: 'z5296486'
      // };

      // const mockStudent2 = {
      //   name: 'Not Quan',
      //   preferredName: 'Not Quan',
      //   email: 'hoangtungquan4@gmail.com', // Same email as mockStudent1
      //   password: 'testPassword',
      //   gender: 'Male',
      //   pronouns: 'He/Him',
      //   tshirtSize: 'M',
      //   universityId: 1,
      //   studentId: 'z5296487'
      // };

      // try {
      //   await sendRequest.post('/student/register', mockStudent1); // First registration should succeed
      //   await sendRequest.post('/student/register', mockStudent2); // This should fail due to duplicate email
      // } catch (error: any) {
      //   expect(error.response.status).toBe(400); // Assuming 409 Conflict for duplicate email
      // }
    });
  });
});
