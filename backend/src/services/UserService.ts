import { UserRepository } from '../repository/UserRepository.js';
import { SessionRepository, SessionTokenObject } from '../repository/SessionRepository.js';
import { Session } from '../models/session/session.js';
import { v4 as uuidv4 } from 'uuid';
import { UserProfileInfo } from '../models/user/user_profile_info.js';
import createHttpError from 'http-errors';
import { Student, validateStudent } from '../models/user/student/student.js';
import { Staff, validateStaff } from '../models/user/staff/staff.js';
import { convertGenderToP, UserType, UserTypeObject } from '../models/user/user.js';
import { UserDashInfo } from '../models/user/user_dash_info.js';
import { LooseStaffInfo, StaffRequests } from '../../shared_types/Competition/staff/StaffInfo.js';
import { ServiceError } from '../errors/ServiceError.js';

export class UserService {
  private userRepository: UserRepository;
  private sessionRepository: SessionRepository;

  constructor(userRepository: UserRepository, sessionRepository: SessionRepository) {
    this.userRepository = userRepository;
    this.sessionRepository = sessionRepository;
  }

  /**
   * Registers a new student and returns a session for them.
   *
   * @param {Student} student The student object containing registration details.
   * @returns {Promise<SessionTokenObject | undefined>} A promise that resolves to a session token object or undefined.
   * @throws {HttpError} Throws an HTTP error if student validation fails.
   */
  studentRegister = async (student: Student): Promise<SessionTokenObject | undefined> => {
    if (!student.pronouns) {
      student.pronouns = convertGenderToP(student.gender);
    }
    const validated = validateStudent(student);
    if (validated) {
      throw createHttpError(400, validated);
    }

    const userIdObject = await this.userRepository.studentRegister(student);
    let session: Session = {
      sessionId: uuidv4(),
      userId: userIdObject.userId,
      createdAt: Math.floor(Date.now() / 1000)
    };
    await this.sessionRepository.create(session);
    return { sessionId: session.sessionId };
  };

  /**
   * Registers a new staff member and creates a session for them.
   *
   * @param {Staff} staff The staff member to register.
   * @returns {Promise<SessionTokenObject | undefined>} A promise that resolves to a session token object if registration is successful, or undefined if not.
   * @throws {HttpError} Throws an HTTP error if the staff validation fails.
   */
  staffRegister = async (staff: Staff): Promise<SessionTokenObject | undefined> => {
    if (!staff.pronouns) {
      staff.pronouns = convertGenderToP(staff.gender);
    }
    const validated = validateStaff(staff);
    if (validated) {
      throw createHttpError(400, validated);
    }

    let userIdObject = await this.userRepository.staffRegister(staff);
    let session: Session = {
      sessionId: uuidv4(),
      userId: userIdObject.userId,
      createdAt: Math.floor(Date.now() / 1000)
    };
    await this.sessionRepository.create(session);

    return { sessionId: session.sessionId };
  };

  /**
   * Logs in a user with the provided email and password.
   * 
   * @param email The email address of the user.
   * @param password The password of the user.
   * @returns {Promise<SessionTokenObject | undefined>} A promise that resolves to a SessionTokenObject containing the session ID, or undefined if login fails.
   * @throws {HttpError} Throws an HTTP error if the email or password is not provided.
   */
  userLogin = async (email: string, password: string): Promise<SessionTokenObject | undefined> => {
    if (!email || email.length === 0) {
      throw createHttpError(400, 'Email is required');
    }
    if (!password || password.length === 0) {
      throw createHttpError(400, 'Password is required');
    }

    const userIdObject = await this.userRepository.userLogin(email, password);
    let session: Session = {
      sessionId: uuidv4(),
      userId: userIdObject.userId,
      createdAt: Math.floor(Date.now() / 1000)
    };
    await this.sessionRepository.create(session);

    return { sessionId: session.sessionId };
  };

  /**
   * Logs out the user by deleting the session associated with the provided session token.
   *
   * @param sessionToken The token of the session to be deleted.
   * @returns A promise that resolves when the session has been successfully deleted.
   */
  userLogout = async (sessionToken: string): Promise<void> => {
    await this.sessionRepository.delete(sessionToken);
    return;
  };

  /**
   * Retrieves the profile information of a user by their user ID.
   *
   * @param userId The unique identifier of the user.
   * @returns {Promise<UserProfileInfo | undefined>} A promise that resolves to the user's profile information, or undefined if the user is not found.
   */
  userProfileInfo = async (userId: number): Promise<UserProfileInfo | undefined> => {
    const userProfileInfo = await this.userRepository.userProfileInfo(userId);
    return userProfileInfo;
  };

  /**
   * Retrieves the dashboard information for a specific user.
   *
   * @param userId The unique identifier of the user.
   * @returns {Promise<UserDashInfo | undefined>} A promise that resolves to the user's dashboard information, or undefined if not found.
   */
  userDashInfo = async (userId: number): Promise<UserDashInfo | undefined> => {
    const userDashInfo = await this.userRepository.userDashInfo(userId);
    return userDashInfo;
  };

  /**
   * Updates the profile information of a user.
   *
   * @param userId The unique identifier of the user whose profile is to be updated.
   * @param userProfile An object containing the new profile information for the user.
   * @returns A promise that resolves when the profile update is complete.
   */
  userUpdateProfile = async (userId: number, userProfile: UserProfileInfo): Promise<void> => {
    await this.userRepository.userUpdateProfile(userId, userProfile);
    return;
  };

  /**
   * Updates the password for a user.
   *
   * @param userId The ID of the user whose password is to be updated.
   * @param oldPassword The current password of the user.
   * @param newPassword The new password to be set for the user.
   * @returns A promise that resolves when the password has been successfully updated.
   * @throws {HttpError} If the old password or new password is not provided.
   */
  userUpdatePassword = async (userId: number, oldPassword: string, newPassword: string): Promise<void> => {
    if (!oldPassword || oldPassword.length === 0) {
      throw createHttpError(400, 'Old password is required');
    }

    if (!newPassword || newPassword.length === 0) {
      throw createHttpError(400, 'New password is required');
    }

    await this.userRepository.userUpdatePassword(userId, oldPassword, newPassword);
    return;
  };

  /**
   * Retrieves the user type for a given user ID.
   *
   * @param userId The ID of the user whose type is to be retrieved.
   * @returns {Promise<UserTypeObject | undefined>} A promise that resolves to a UserTypeObject if found, otherwise undefined.
   */
  userType = async (userId: number): Promise<UserTypeObject | undefined> => {
    const userTypeObject = await this.userRepository.userType(userId);
    return userTypeObject;
  };

  /**
   * retrieves all staff in user. (Requested staff are included)
   *
   * @param userId The ID of the user who asked to retrieve the information.
   * @returns {Promise<UserTypeObject | undefined>} A promise that resolves to a UserTypeObject if found, otherwise undefined.
   */
  staffRequests = async (userId: number): Promise<Array<LooseStaffInfo> | undefined> => {
    const userCheckAdmin:UserTypeObject = await this.userRepository.userType(userId);
    if (userCheckAdmin.type !== UserType.SYSTEM_ADMIN) {
      throw new ServiceError(ServiceError.Auth, 'User does not have access to this list');
    }
    
    return this.userRepository.staffRequests();
  };

  /**
   * Updates the access levels of multiple staff users in the database.
   *
   * @param staffRequests An array of `StaffRequests` objects containing user IDs and their corresponding access levels.
   * @returns A promise that resolves when the update operation is complete.
   * @throws {ServiceError} If the user is not a system admin.
   */
  staffRequestsUpdate = async (userId: number, staffRequests: Array<StaffRequests>): Promise<void> => {
    const userCheckAdmin:UserTypeObject = await this.userRepository.userType(userId);
    if (userCheckAdmin.type !== UserType.SYSTEM_ADMIN) {
      throw new ServiceError(ServiceError.Auth, 'User does not have access to this list');
    }

    await this.userRepository.staffRequestsUpdate(staffRequests);
  };
}