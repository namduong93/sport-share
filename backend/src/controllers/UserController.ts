import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/UserService.js';
import { httpErrorHandler } from './controller_util/httpErrorHandler.js';
import { Student } from '../models/user/student/student.js';
import { Staff } from '../models/user/staff/staff.js';
import { defaultCookieOptions } from './controller_util/defaultCookieOptions.js';
import { UserProfileInfo } from '../models/user/user_profile_info.js';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   * Handles the registration of a new student.
   */
  studentRegister = httpErrorHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Use stuff from Request parameters to call methods on this.userService and res.json it.
    const new_student: Student = {
      name: req.body.name,
      preferredName: req.body.preferredName,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      pronouns: req.body.pronouns,
      tshirtSize: req.body.tshirtSize,
      allergies: req.body.allergies,
      dietaryReqs: req.body.dietaryReqs,
      accessibilityReqs: req.body.accessibilityReqs,
      universityId: req.body.universityId,
      studentId: req.body.studentId,
    };

    const sessionIdObject = await this.userService.studentRegister(new_student);
    res.cookie('sessionId', sessionIdObject.sessionId, defaultCookieOptions);

    res.json({});
    return;
  });

  /**
   * Handles the registration of a staff.
   */
  staffRegister = httpErrorHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const new_staff: Staff = {
      name: req.body.name,
      preferredName: req.body.preferredName,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      pronouns: req.body.pronouns,
      tshirtSize: req.body.tshirtSize,
      allergies: req.body.allergies,
      dietaryReqs: req.body.dietaryReqs,
      accessibilityReqs: req.body.accessibilityReqs,
      universityId: req.body.universityId,
    };

    const sessionIdObject = await this.userService.staffRegister(new_staff);
    res.cookie('sessionId', sessionIdObject.sessionId, defaultCookieOptions);
    
    res.json({});
    return;
  });

  
  /**
   * Handles user login, sets session cookie, and returns an empty JSON response.
   */
  userLogin = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const email = req.body.email;
    const password = req.body.password;

    const sessionIdObject = await this.userService.userLogin(email, password);
    res.cookie('sessionId', sessionIdObject.sessionId, defaultCookieOptions);
    res.json({});

    return;
  });

  /**
   * Logs out the user by clearing the session cookie and ending the session.
   */
  userLogout = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const sessionId = req.cookies.sessionId;
    await this.userService.userLogout(sessionId);
    res.clearCookie('sessionId');
    res.json({});
    return;
  });

  /**
   * Retrieves user profile information based on the provided user ID.
   */
  userProfileInfo = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const userProfileInfo = await this.userService.userProfileInfo(Number(userId));
    res.json(userProfileInfo);
    return;
  });

  /**
   * Retrieves user dashboard information (name + university) based on the provided user ID.
   */
  userDashInfo = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const userDashInfo = await this.userService.userDashInfo(Number(userId));
    res.json(userDashInfo);
    return;
  });

  /**
   * Updates the user profile with the provided information.
   */
  userUpdateProfile = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const userProfile : UserProfileInfo = {
      name: req.body.name,
      preferredName: req.body.preferredName,
      email: req.body.email,
      affiliation: req.body.affiliation,
      gender: req.body.gender,
      pronouns: req.body.pronouns,
      tshirtSize: req.body.tshirtSize,
      allergies: req.body.allergies,
      dietaryReqs: req.body.dietaryReqs,
      accessibilityReqs: req.body.accessibilityReqs,
    };
    await this.userService.userUpdateProfile(Number(userId), userProfile);
    res.json({});
    return;
  });

  /**
   * Updates the user's password given the old and new passwords.
   */
  userUpdatePassword = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { oldPassword, newPassword } = req.body;
    await this.userService.userUpdatePassword(Number(userId), oldPassword, newPassword);
    res.json({});
    return;
  });

  /**
   * Handles the request to get the user type.
   */
  userType = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const userDashInfo = await this.userService.userType(Number(userId));
    res.json({...userDashInfo, profilePic: ''});
    return;
  });

  /**
   * Handles the request to get all staff members.
   */
  staffRequests = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const staffList = await this.userService.staffRequests(Number(userId));
    res.json({staffRequests: staffList});
    return;
  });

  /**
   * Handles the request to update staff members details.
   */
  staffRequestsUpdate = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { staffRequests } = req.body;
    const result = await this.userService.staffRequestsUpdate(Number(userId), staffRequests);
    res.json(result);
    return;
  });
}