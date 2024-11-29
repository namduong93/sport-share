import { UserAccess } from "../../User/User.js";
import { CompetitionRole } from "../CompetitionRole.js";

export const enum StaffAccess {
  Accepted = 'Accepted',
  Pending = 'Pending',
  Rejected = 'Rejected',
}

export interface LooseStaffInfo {
  userId?: number;
  universityId: number;
  universityName?: string;
  name: string;
  email: string;
  sex: string;
  pronouns: string;
  tshirtSize: string;
  allergies: string;
  dietaryReqs: string;
  accessibilityReqs: string;
  userAccess: UserAccess;

  bio?: string;
  roles?: CompetitionRole[];
  access?: StaffAccess;
}

export interface StaffInfo {
  userId?: number;
  universityId: number;
  universityName?: string;
  name: string;
  email: string;
  sex: string;
  pronouns: string;
  tshirtSize: string;
  allergies: string;
  dietaryReqs: string;
  accessibilityReqs: string;
  userAccess: UserAccess;

  bio?: string;
  roles: CompetitionRole[];
  access: StaffAccess;
}

export interface StaffRequests {
  uuid: string;
  access: UserAccess;
}