import { CompetitionRole } from "../../shared_types/Competition/CompetitionRole";

export const testAttendee = {
  userId: 1,
  universityId: 1,
  universityName: 'test uni',
  name: 'test name',
  preferredName: 'test preferred name',
  email: 'test@example.com',
  sex: 'M',
  tshirtSize: 'MXL',
  dietaryNeeds: '',
  accessibilityNeeds: '',
  allergies: '',
  teamSeat: 'Bongo11',

  roles: [CompetitionRole.Participant],

  siteId: 1,
  pendingSiteId: 1,
  siteName: 'test site',
  pendingSiteName: 'test pending site',
  siteCapacity: 100,
  pendingSiteCapacity: 200,
};