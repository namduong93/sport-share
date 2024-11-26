import { User, validateUser } from '../user.js';

export interface Student extends User {
  universityId: number | undefined;
  studentId: string | undefined;
};


/**
 * Validates the given student object.
 *
 * @param student - The student object to be validated.
 * @returns A string containing the validation error message if validation fails,
 *          or an empty string if validation passes.
 */
export function validateStudent(student: Student): string {
  // Validate the student object
  let userValidation = validateUser(student);
  if(userValidation) {
    return userValidation;
  }

  return '';
}