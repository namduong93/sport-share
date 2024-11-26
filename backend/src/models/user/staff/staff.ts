import { User, validateUser } from '../user.js';

export interface Staff extends User {
  universityId: number;
};

/**
 * Validates the given staff object.
 *
 * @param {Staff} staff - The staff object to validate.
 * @returns {string} - Returns an empty string if the staff object is valid, 
 *                     otherwise returns an error message indicating the validation failure.
 */
export function validateStaff(staff: Staff): string {
  // Validate the staff object
  let userValidation = validateUser(staff);
  if (userValidation) {
    return userValidation;
  }

  if (!staff.universityId) {
    return 'University ID is required';
  }

  return '';
}