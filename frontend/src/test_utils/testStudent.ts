import { CompetitionLevel } from "../../shared_types/Competition/CompetitionLevel";
import { CompetitionRole } from "../../shared_types/Competition/CompetitionRole";
import { CourseCategory } from "../../shared_types/University/Course";

export const testStudent = {
  userId: 1,
  universityId: 1,
  universityName: 'test uni',
  name: 'test name',
  preferredName: 'test preferred name',
  email: 'test@example.com',
  sex: 'F',
  pronouns: 'she/her',
  tshirtSize: 'MXL',
  allergies: '',
  dietaryReqs: '',
  accessibilityReqs: '',
  studentId: '01234567',

  // competition_user info
  roles: [CompetitionRole.Participant],
  bio: 'test bio',
  ICPCEligible: true,
  boersenEligible: true,
  level: CompetitionLevel.LevelA,
  degreeYear: 3,
  degree: 'CompSci',
  isRemote: false,
  isOfficial: true,
  preferredContact: 'discord:test',
  nationalPrizes: '',
  internationalPrizes: '',
  codeforcesRating: 0,
  universityCourses: [CourseCategory.Introduction],
  pastRegional: false,
  status: 'Unmatched',

  // team info
  teamName: 'test team name',
  siteName: 'test site name',
  siteId: 1,
};