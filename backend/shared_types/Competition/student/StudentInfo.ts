import { CompetitionLevel } from '../CompetitionLevel';
import { CompetitionRole } from '../CompetitionRole';

export interface StudentInfo {
  userId?: number;
  universityId: number;
  universityName: string;
  name: string;
  preferredName: string;
  email: string;
  sex: string;
  pronouns: string;
  tshirtSize: string;
  allergies: string;
  dietaryReqs: string;
  accessibilityReqs: string;
  studentId: string;

  // competition_user info
  roles: CompetitionRole[];
  bio: string;
  ICPCEligible: boolean;
  boersenEligible: boolean;
  level: CompetitionLevel;
  degreeYear: number;
  degree: string;
  isRemote: boolean;
  isOfficial: boolean;
  preferredContact: string;
  nationalPrizes: string;
  internationalPrizes: string;
  codeforcesRating: number;
  universityCourses: string[];
  pastRegional: boolean;
  status: string;

  // team info
  teamName?: string;
  siteName?: string;
  siteId?: number;
};
