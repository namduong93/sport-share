import { Pool } from 'pg';
import { UserIdObject, UserRepository } from '../UserRepository.js';
import { Student } from '../../models/user/student/student.js';
import bcrypt from 'bcryptjs';
import { UserProfileInfo } from '../../models/user/user_profile_info.js';
import { Staff } from '../../models/user/staff/staff.js';
import { UserType, UserTypeObject } from '../../models/user/user.js';
import { UserDashInfo } from '../../models/user/user_dash_info.js';
import { DbError } from '../../errors/DbError.js';
import { University } from '../../models/university/university.js';
import { LooseStaffInfo, StaffRequests } from '../../../shared_types/Competition/staff/StaffInfo.js';
import { UserAccess } from '../../../shared_types/User/User.js';

export class SqlDbUserRepository implements UserRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Registers a new student in the database.
   *
   * @param {Student} student The student object containing the registration details.
   * @returns {Promise<UserIdObject>} A promise that resolves to an object containing the new user's ID.
   * @throws {DbError} Throws an error if a student with the given email already exists.
   */
  studentRegister = async (student: Student): Promise<UserIdObject> => {
    // Use the params to run an sql insert on the db

    let name = student.name;
    let preferredName = student.preferredName;
    let email = student.email;
    let hashed_password = await bcrypt.hash(student.password, 10);
    let gender = student.gender;
    let pronouns = student.pronouns;
    let tshirtSize = student.tshirtSize;
    let allergies = student.allergies;
    let dietaryReqs = student.dietaryReqs || [];
    let accessibilityReqs = student.accessibilityReqs;

    // Check if user with email already exists
    const checkUserQuery = `
      SELECT id FROM users WHERE email = $1 AND user_access = 'Accepted' LIMIT 1;
    `;
    const checkUserResult = await this.pool.query(checkUserQuery, [email]);
    if (checkUserResult.rowCount > 0) {
      throw new DbError(DbError.Query, 'Student with this email already exists');
    }

    //Add user to users table
    const userQuery =
      `INSERT INTO users (name, preferred_name, email, hashed_password, gender, pronouns, tshirt_size, allergies, dietary_reqs, accessibility_reqs,
      user_type, university_id, student_id, user_access)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id;
    `;
    const userValues = [
      name,
      preferredName,
      email,
      hashed_password,
      gender,
      pronouns,
      tshirtSize,
      allergies,
      dietaryReqs,
      accessibilityReqs,
      UserType.STUDENT,
      student.universityId,
      student.studentId,
      UserAccess.Accepted
    ];
    const userResult = await this.pool.query(userQuery, userValues);
    const newUserId = userResult.rows[0].id;

    return { userId: newUserId };
  };

  /**
   * Registers a new staff member in the database.
   *
   * @param {Staff} staff The staff object containing the details of the staff member to be registered.
   * @returns {Promise<UserIdObject>} A promise that resolves to an object containing the new user's ID.
   * @throws {DbError} Throws an error if a staff member with the same email already exists.
   */
  staffRegister = async (staff: Staff): Promise<UserIdObject> => {
    // Use the params to run an sql insert on the db
    let name = staff.name;
    let preferredName = staff.preferredName === "" ? null : staff.preferredName;
    let email = staff.email;
    let hashed_password = await bcrypt.hash(staff.password, 10);
    let gender = staff.gender;
    let pronouns = staff.pronouns;
    let tshirtSize = staff.tshirtSize;
    let allergies = staff.allergies;
    let dietaryReqs = staff.dietaryReqs || [];
    let accessibilityReqs = staff.accessibilityReqs;

    // Check if user with email already exists
    const checkUserQuery = `
      SELECT id FROM users WHERE email = $1;
    `;
    const checkUserResult = await this.pool.query(checkUserQuery, [email]);
    if (checkUserResult.rowCount > 0) {
      throw new DbError(DbError.Query, 'Staff with this email already exists');
    }

    const userQuery = `INSERT INTO users (name, preferred_name, email, hashed_password, gender, pronouns, tshirt_size, allergies, dietary_reqs, accessibility_reqs,
      user_type, university_id, student_id, user_access)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id;
    `;
    const userValues = [
      name,
      preferredName,
      email,
      hashed_password,
      gender,
      pronouns,
      tshirtSize,
      allergies,
      dietaryReqs,
      accessibilityReqs,
      UserType.STAFF,
      staff.universityId,
      null,
      UserAccess.Pending
    ];
    const userResult = await this.pool.query(userQuery, userValues);
    const newUserId = userResult.rows[0].id;

    return { userId: newUserId };
  };

  /**
   * Authenticates a user by their email and password.
   *
   * @param email The email address of the user attempting to log in.
   * @param password The plaintext password of the user attempting to log in.
   * @returns {Promise<UserIdObject>} A promise that resolves to an object containing the user's ID if authentication is successful.
   * @throws {DbError} If the user does not exist or the password is incorrect.
   */
  userLogin = async (email: string, password: string): Promise<UserIdObject> => {
    const userQuery = 'SELECT id, hashed_password FROM users WHERE email = $1 AND user_access = \'Accepted\' LIMIT 1';
    const userResult = await this.pool.query(userQuery, [email]);

    if (userResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User with email does not exist');
    }

    if (!await bcrypt.compare(password, userResult.rows[0].hashed_password)) {
      throw new DbError(DbError.Auth, 'Incorrect password');
    }

    return { userId: userResult.rows[0].id };
  };

  /**
   * Retrieves the profile information of a user by their user ID.
   *
   * @param userId The unique identifier of the user.
   * @returns {Promise<UserProfileInfo>} A promise that resolves to the user's profile information.
   * @throws {DbError} If the user is not found in the database.
   */
  userProfileInfo = async (userId: number): Promise<UserProfileInfo> => {
    const userQuery =
      `SELECT id, name, preferred_name AS "preferredName", email, affiliation, gender, pronouns,
      tshirt_size AS "tshirtSize", allergies, dietary_reqs AS "dietaryReqs",
      accessibility_reqs AS "accessibilityReqs" FROM user_profile_info WHERE id = $1 LIMIT 1`;

    const userResult = await this.pool.query(userQuery, [userId]);
    if (userResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User not found');
    }

    return userResult.rows[0];
  };

  /**
   * Retrieves the dashboard information (name + university) for a user by their user ID.
   *
   * @param userId The ID of the user whose dashboard information is to be retrieved.
   * @returns {Promise<UserDashInfo>} A promise that resolves to the user's dashboard information.
   * @throws {DbError} If the user is not found in the database.
   */
  userDashInfo = async (userId: number): Promise<UserDashInfo> => {
    const dbResult = await this.pool.query(
      `SELECT preferred_name AS "preferredName", affiliation FROM user_dash_info WHERE id = $1 LIMIT 1`
    , [userId]);

    if (dbResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User not found');
    }

    const userDashInfo = dbResult.rows[0];
    userDashInfo.preferredName = userDashInfo.preferredName.split(' ')[0];

    return dbResult.rows[0];
  };

  /**
   * Updates the profile information of a user in the database.
   *
   * @param userId The unique identifier of the user.
   * @param {UserProfileInfo} userProfile An object containing the user's profile information.
   * @returns A promise that resolves when the user's profile has been updated.
   */
  userUpdateProfile = async (userId: number, userProfile: UserProfileInfo): Promise<void> => {
    const userQuery = `
      UPDATE users 
      SET 
        name = $2,
        preferred_name = $3,
        email = $4,
        gender = $5,
        pronouns = $6,
        tshirt_size = $7,
        allergies = $8,
        dietary_reqs = $9,
        accessibility_reqs = $10
      WHERE id = $1;
    `;
    const userValues = [
      userId,
      userProfile.name,
      userProfile.preferredName,
      userProfile.email,
      userProfile.gender,
      userProfile.pronouns,
      userProfile.tshirtSize,
      userProfile.allergies,
      userProfile.dietaryReqs || [],
      userProfile.accessibilityReqs,
    ];
    await this.pool.query(userQuery, userValues);
    return;
  };

  /**
   * Updates the password for a user.
   *
   * @param userId The ID of the user whose password is to be updated.
   * @param oldPassword The current password of the user.
   * @param newPassword The new password to be set for the user.
   * @returns A promise that resolves when the password has been successfully updated.
   * @throws {DbError} If the user is not found, the current password is incorrect, or the new password is the same as the old password.
   */
  userUpdatePassword = async (userId: number, oldPassword: string, newPassword: string): Promise<void> => {
    const userQuery = 'SELECT hashed_password FROM users WHERE id = $1 AND user_access = \'Accepted\' LIMIT 1';
    const userResult = await this.pool.query(userQuery, [userId]);

    if (userResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User not found');
    }

    // Check if old password is correct
    if (!await bcrypt.compare(oldPassword, userResult.rows[0].hashed_password)) {
      throw new DbError(DbError.Query, 'Current password is incorrect');
    }

    if (await bcrypt.compare(newPassword, userResult.rows[0].hashed_password)) {
      throw new DbError(DbError.Query, 'New password must be different from old password');
    }

    // Update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = 'UPDATE users SET hashed_password = $2 WHERE id = $1;';
    await this.pool.query(updateQuery, [userId, hashedPassword]);

    // Delete all associated sessions after the password update
    const deleteSessionsQuery = 'DELETE FROM sessions WHERE user_id = $1;';
    await this.pool.query(deleteSessionsQuery, [userId]);

    return;
  };

  /**
   * Retrieves the user type for a given user ID.
   *
   * @param userId The ID of the user whose type is to be retrieved.
   * @returns {Promise<UserTypeObject>} A promise that resolves to an object containing the user type.
   * @throws {DbError} If the user is not found in the database.
   */
  userType = async (userId: number): Promise<UserTypeObject> => {

    const dbResult = await this.pool.query(
      `SELECT user_type AS "userType" FROM users WHERE id = $1 LIMIT 1`
    , [userId]);

    if (dbResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User not found');
    }

    return { type: dbResult.rows[0].userType };
  };

  /**
   * Retrieves the university information for a given user.
   *
   * @param userId The ID of the user whose university information is to be retrieved.
   * @returns {Promise<University>} A promise that resolves to an object containing the university ID and name.
   * @throws {DbError} If the user is not found or the university is not found.
   */
  userUniversity = async (userId: number): Promise<University> => {
    const universityIdResult = await this.pool.query('SELECT university_id FROM users WHERE id = $1', [userId]);
    if (universityIdResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User not found');
    }
    const universityId = universityIdResult.rows[0].university_id;

    const universityNameResult = await this.pool.query('SELECT name FROM universities WHERE id = $1', [universityId]);
    if (universityNameResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'University not found');
    }
    const universityName = universityNameResult.rows[0].name;

    return { id: universityId, name: universityName };
  };

  /**
   * Retrieves a list of all staff members from the database.
   *
   * @returns {Promise<Array<LooseStaffInfo>>} A promise that resolves to an array of `LooseStaffInfo` objects.
   */
  staffRequests = async (): Promise<Array<LooseStaffInfo>> => {
    const dbResult = await this.pool.query(`
      SELECT 
        id,
        university_id,
        name,
        email,
        gender,
        pronouns,
        tshirt_size,
        allergies,
        dietary_reqs,
        accessibility_reqs,
        user_access
      FROM users 
      WHERE user_type = 'staff'::user_type_enum
      ORDER BY user_access, name ASC
    `);
    const returnArray: Array<LooseStaffInfo> = [];
    for (const row of dbResult.rows) {
      let staffInfo: LooseStaffInfo = {
        userId: row.id,
        universityId: row.university_id,
        name: row.name,
        email: row.email,
        sex: row.gender,
        pronouns: row.pronouns,
        tshirtSize: row.tshirt_size,
        allergies: row.allergies,
        dietaryReqs: row.dietary_reqs,
        accessibilityReqs: row.accessibility_reqs,
        userAccess: row.user_access
      };
      returnArray.push(staffInfo);
    }
    return returnArray;
  };

  /**
   * Updates the access levels of multiple staff users in the database.
   *
   * @param staffRequests An array of `StaffRequests` objects containing user IDs and their corresponding access levels.
   * @returns A promise that resolves when the update operation is complete.
   */
  staffRequestsUpdate = async (staffRequests: Array<StaffRequests>): Promise<void> => {
    const userIds = staffRequests.map((request) => request.userId);
    const accessValues = staffRequests.map((request) => request.access);

    await this.pool.query(
      `UPDATE users 
      SET user_access = updated_values.access::user_access_enum
      FROM (
        SELECT unnest($1::int[]) as user_id, 
                unnest($2::text[]) as access
      ) as updated_values
      WHERE users.id = updated_values.user_id`,
      [userIds, accessValues]
    );
  };
}
