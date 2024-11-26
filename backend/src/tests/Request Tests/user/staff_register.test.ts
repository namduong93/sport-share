
describe('POST /staff/register', () => {
  describe('successful cases', () => {
    test('success', async () => {
      // const mockStaff: Staff = {
      //   name: 'Quan',
      //   preferredName: 'Quan',
      //   email: 'tungquanhoang@gmail.com',
      //   password: 'testPassword',
      //   gender: 'Male',
      //   pronouns: 'He/Him',
      //   tshirtSize: 'M',
      //   universityId: 1,
      // };

      // const response = await sendRequest.post('/staff/register', mockStaff);
      // expect(response.status).toBe(200);
      // expect(response.data).toEqual({});
    });
  });

  describe('failing cases', () => {
    test('missing name', async () => {
      // const newStaff: Staff = {
      //   name: '',
      //   preferredName: 'Quan',
      //   email: 'tungquanhoang1@gmail.com',
      //   password: 'testPassword',
      //   gender: 'Male',
      //   pronouns: 'He/Him',
      //   tshirtSize: 'M',
      //   universityId: 1,
      // };

      // try {
      //   await sendRequest.post('/staff/register', newStaff);
      // } catch (error: any) {
      //   expect(error.response.status).toBe(400);
      // }
    });

    test('missing email', async () => {
      // const newStaff: Staff = {
      //   name: 'Quan',
      //   preferredName: 'Quan',
      //   email: '',
      //   password: 'testPassword',
      //   gender: 'Male',
      //   pronouns: 'He/Him',
      //   tshirtSize: 'M',
      //   universityId: 1,
      // };

      // try {
      //   await sendRequest.post('/staff/register', newStaff);
      // } catch (error: any) {
      //   expect(error.response.status).toBe(400);
      // }
    });

    test('missing password', async () => {
      // const newStaff: Staff = {
      //   name: 'Quan',
      //   preferredName: 'Quan',
      //   email: 'tungquanhoang2@gmail.com',
      //   password: '',
      //   gender: 'Male',
      //   pronouns: 'He/Him',
      //   tshirtSize: 'M',
      //   universityId: 1,
      // };

      // try {
      //   await sendRequest.post('/staff/register', newStaff);
      // } catch (error: any) {
      //   expect(error.response.status).toBe(400);
      // }
    });

    test('missing t-shirt size', async () => {
      // const newStaff: Staff = {
      //   name: 'Quan',
      //   preferredName: 'Quan',
      //   email: 'tungquanhoang3@gmail.com',
      //   password: 'testPassword',
      //   gender: 'Male',
      //   pronouns: 'He/Him',
      //   tshirtSize: '',
      //   universityId: 1,
      // };

      // try {
      //   await sendRequest.post('/staff/register', newStaff);
      // } catch (error: any) {
      //   expect(error.response.status).toBe(400);
      // }
    });

    test('duplicated email', async () => {
      // const mockStaff1: Staff = {
      //   name: 'Quan',
      //   preferredName: 'Quan',
      //   email: 'tungquanhoang4@gmail.com',
      //   password: 'testPassword',
      //   gender: 'Male',
      //   pronouns: 'He/Him',
      //   tshirtSize: 'M',
      //   universityId: 1,
      // };

      // const mockStaff2: Staff = {
      //   name: 'Not Quan',
      //   preferredName: 'Not Quan',
      //   email: 'tungquanhoang4@gmail.com',
      //   password: 'testPassword',
      //   gender: 'Male',
      //   pronouns: 'He/Him',
      //   tshirtSize: 'M',
      //   universityId: 1,
      // };

      // try {
      //   await sendRequest.post('/staff/register', mockStaff1); // First registration should succeed
      //   await sendRequest.post('/staff/register', mockStaff2); // This should fail due to duplicate email
      // } catch (error: any) {
      //   expect(error.response.status).toBe(400);
      // }
    });
  });
});
