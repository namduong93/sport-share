/**
 * Represents a user in the system
 */
export interface User {
  id?: number;
  name: string;
  preferredName?: string | undefined;
  email: string;
  password: string;
  gender: string;
  pronouns: string;
  tshirtSize: string;
  allergies?: string | undefined;
  dietaryReqs?: string[] | undefined;
  accessibilityReqs?: string | undefined;
};


/**
 * Validates the user object to ensure all required fields are present and non-empty.
 *
 * @param {User} user The user object to validate.
 * @returns {string} An error message if validation fails, otherwise an empty string.
 */
export function validateUser(user: User): string {
  // Validate the user object
  if (!user.name || user.name.length === 0) {
    return 'Name is required';
  }

  if (!user.email || user.email.length === 0) {
    return 'Email is required';
  }

  if (!user.password || user.password.length === 0) {
    return 'Password is required';
  }

  if (!user.tshirtSize || user.tshirtSize.length === 0) {
    return 'Tshirt size is required';
  }

  if(!user.gender || user.gender.length === 0) {
    return 'Gender is required';
  }

  if(!user.pronouns || user.pronouns.length === 0) {
    return 'Pronouns is required';
  }

  return '';
}

/**
 * Represents the type of user in the system.
 */
export const enum UserType {
  STUDENT = 'student',
  STAFF = 'staff',
  SYSTEM_ADMIN = 'system_admin'
}

/**
 * Represents a user type object.
 */
export type UserTypeObject = { type: UserType };

/**
 * Converts a gender string to its corresponding pronouns.
 *
 * @param gender The gender string to convert. Expected values are "Male", "Female", or any other string for non-binary.
 * @returns {string} The corresponding pronouns as a string. Returns "He/Him" for "Male", "She/Her" for "Female", and "They/Them" for any other value.
 */
export function convertGenderToP(gender: string): string {
  switch (gender) {
    case 'Male':
      return 'He/Him';
    case 'Female':
      return 'She/Her';
    default:
      return 'They/Them';
  }
}

