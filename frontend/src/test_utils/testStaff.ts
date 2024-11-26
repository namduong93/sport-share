import { CompetitionRole } from "../../shared_types/Competition/CompetitionRole";
import { StaffAccess, StaffInfo } from "../../shared_types/Competition/staff/StaffInfo";
import { UserAccess } from "../../shared_types/User/User";

export const testStaff: StaffInfo = {
  userId: 1,
  universityId: 1,
  universityName: 'test uni',
  name: 'person 1 name',
  email: 'person1@example.com',
  sex: 'M',
  pronouns: 'he/him',
  tshirtSize: 'MXL',
  allergies: '',
  dietaryReqs: '',
  accessibilityReqs: '',
  userAccess: UserAccess.Pending,
  
  bio: 'person 1 bio',
  roles: [CompetitionRole.Coach],
  access: StaffAccess.Pending
}
  