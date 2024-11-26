import { Student } from '../models/user/student/student.js';
import { Staff } from '../models/user/staff/staff.js';
import { UserProfileInfo } from '../models/user/user_profile_info.js';
import { UserTypeObject } from '../models/user/user.js';
import { UserDashInfo } from '../models/user/user_dash_info.js';
import { University } from '../models/university/university.js';
import { LooseStaffInfo, StaffRequests } from '../../shared_types/Competition/staff/StaffInfo.js';

export type UserIdObject = { userId: number };
export interface UserRepository {
  studentRegister(student: Student): Promise<UserIdObject>;
  staffRegister(staff: Staff): Promise<UserIdObject>;

  userLogin(email: string, password: string): Promise<UserIdObject>;

  userProfileInfo(userId: number): Promise<UserProfileInfo>;
  userUpdateProfile(userId: number, userProfile: UserProfileInfo): Promise<void>;
  userUpdatePassword(userId: number, oldPassword: string, newPassword: string): Promise<void>;

  userType(userId: number): Promise<UserTypeObject>;
  userDashInfo(userId: number): Promise<UserDashInfo>;

  userUniversity(userId: number): Promise<University>;

  staffRequests(): Promise<Array<LooseStaffInfo>>;
  staffRequestsUpdate(staffRequests: Array<StaffRequests>): Promise<void>;
};