import { University } from '../university/university';
import { CompetitionSiteObject } from './competition';

/**
 * Represents a competition user (student and staff).
 */
export interface CompetitionUser {
  userId?: number;
  competitionId: number;
  competitionRoles: Array<CompetitionUserRole>;
  ICPCEligible: boolean;
  competitionLevel: string;
  siteLocation: CompetitionSiteObject;
  boersenEligible: boolean;
  degreeYear: number;
  degree: string;
  isRemote: boolean;
  nationalPrizes: string;
  internationalPrizes: string;
  codeforcesRating: number;
  universityCourses: string[];
  pastRegional: boolean;
  competitionBio: string;
  preferredContact: string;
}

/**
 * Represents a competition staff (admin, coach, or site coordinator).
 */
export interface CompetitionStaff {
  userId: number;
  name?: string;
  email?: string;
  competitionRoles: Array<CompetitionUserRole>;
  accessLevel: CompetitionAccessLevel;
  siteLocation?: CompetitionSiteObject; // Coach + Site Coordinator
  university?: University; // Coach
  competitionBio?: string; // Coach
}

/**
 * Represents  the details of a student participating in a competition.
 */
export interface CompetitionStudentDetails {
  name: string;
  email: string;
  preferredContact: string;
  image?: string;
  competitionBio: string;
  competitionLevel: string;
  ICPCEligible: boolean;
  boersenEligible: boolean;
  degreeYear: number;
  degree: string;
  isRemote: boolean;
  nationalPrizes?: string;
  internationalPrizes: string;
  codeforcesRating?: number;
  universityCourses: string[];
  pastRegional?: boolean;
}

/**
 * Represents the details (relevant for team-making algorithm) of a student participating in an competition.
 */
export interface CompetitionAlgoStudentDetails {
  id?: number;
  userId: number;
  preferred_contact?: string;
  competitionLevel: CompetitionLevel;
  ICPCEligible: boolean;
  boersenEligible: boolean;
  degreeYear: number;
  degree: string;
  isRemote: boolean;
  nationalPrizes: string;
  internationalPrizes: string;
  codeforcesRating: number;
  universityCourses: string[];
  pastRegional: boolean;
  algoPoint: number;
}

/**
 * Represents the details of a team (relevant for team-making algorithm) participating in a competition.
 */
export interface CompetitionAlgoTeamDetails {
  id?: number;
  name: string;
  pendingName?: string;
  teamSize: number;
  participants: CompetitionAlgoStudentDetails[];
  universityId: number;
  teamSeat?: string;
  siteAttendingId?: number;
  competitionId: number;
  competitionCoachId: number;
  teamStatus: TeamStatus;
}

/**
 * Represents the access level of a staff member in a competition.
 */
export const enum CompetitionAccessLevel {
  ACCEPTED = 'Accepted',
  PENDING = 'Pending',
  REJECTED = 'Rejected',
}

/**
 * Represents the roles a user can have in a competition.
 */
export const enum CompetitionUserRole {
  PARTICIPANT = 'Participant',
  COACH = 'Coach',
  ADMIN = 'Admin',
  SITE_COORDINATOR = 'Site-Coordinator'
}

/**
 * Represents the different levels of competition that a student can participate in.
 */
export const enum CompetitionLevel {
  LEVEL_A = 'Level A',
  LEVEL_B = 'Level B',
  NO_PREFERENCE = 'No Preference'
}

/**
 * Represents a score-conversion for different achievements from the student.
 */
export const enum AlgoConversion {
  INTRO_COURSE = 600,
  DSA_COURSE = 800,
  ADVANCED_COURSE = 1000,
  CHALLENGE_COURSE = 1300,
  NATIONAL_PRIZE = 1600,
  PAST_REGIONAL = 1700,
  INTERNATION_PRIZE = 1800,
}

// export const enum DefaultUniCourses {
//   INTRO_COURSE = 'Introduction to Programming / Programming Fundamentals',
//   DSA_COURSE = 'Data Structures and Algorithms',
//   ADVANCED_ALGO_COURSE = 'Algorithm Design and Analysis',
//   CHALLENGE_COURSE = 'Programming Challenges and Problems',
// }

/**
 * Represents the status of a team.
 */
export const enum TeamStatus {
  Pending = 'Pending',
  Registered = 'Registered',
  Unregistered = 'Unregistered',
}