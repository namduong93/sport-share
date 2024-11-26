/**
 * Represents the profile info of a user.
 */
export interface UserProfileInfo {
  name: string;
  preferredName: string;
  email: string;
  affiliation: string;
  gender: string;
  pronouns: string;
  tshirtSize: string;
  allergies: string | undefined;
  dietaryReqs: string[] | undefined;
  accessibilityReqs?: string | undefined;
};
