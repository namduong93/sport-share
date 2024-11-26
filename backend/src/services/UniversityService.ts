
import { UniversityListObject } from '../models/university/university.js';
import { UniversityRepository } from '../repository/UniversityRepository.js';

export type SessionIdObject = { sessionId: string };

export class UniversityService {
  private universityRepository: UniversityRepository;
  
  constructor(userRepository: UniversityRepository) {
    this.universityRepository = userRepository;
  }

  /**
   * Retrieves the university courses associated with a given user.
   *
   * @param userId The ID of the user whose university courses are to be retrieved.
   * @returns A promise that resolves to the list of university courses for the specified user.
   */
  universityCourses = async (userId: number, code: string) => {
    return await this.universityRepository.universityCourses(userId, code);
  };

  /**
   * Retrieves a list of universities from the university repository.
   *
   * @returns {Promise<UniversityListObject>} A promise that resolves to an object containing the list of universities.
   */
  universitiesList = async (): Promise<UniversityListObject> => {
    let universitiesList = await this.universityRepository.universitiesList();
    return universitiesList;
  };
}