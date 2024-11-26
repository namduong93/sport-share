import { CompetitionRole } from '../CompetitionRole';

export interface AttendeesDetails {
  userId: number;
  universityId: number;
  universityName: string;
  name: string;
  preferredName: string;
  email: string;
  sex: string;
  tshirtSize: string;
  dietaryNeeds: string | null;
  accessibilityNeeds: string | null;
  allergies: string | null;
  teamSeat: string;

  roles: Array<CompetitionRole>;

  siteId: number;
  pendingSiteId: number;
  siteName: string;
  pendingSiteName: string;
  siteCapacity: number;
  pendingSiteCapacity: number;
  
}