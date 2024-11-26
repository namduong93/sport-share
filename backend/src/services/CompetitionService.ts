import { COMPETITION_NOT_FOUND, COMPETITION_USER_REGISTERED } from '../controllers/controller_util/httpErrorHandler.js';
import { ServiceError } from '../errors/ServiceError.js';
import { CompetitionInput, CompetitionShortDetailsObject, CompetitionSiteObject } from '../models/competition/competition.js';
import { CompetitionRepository } from '../repository/CompetitionRepository.js';
import { NotificationRepository } from '../repository/NotificationRepository.js';
import { UserRepository } from '../repository/UserRepository.js';
import { University } from '../models/university/university.js';

export type IncompleteTeamIdObject = { incompleteTeamId: number };
export type TeamIdObject = { teamId: number };
export type UniversityDisplayInfo = { id: number, name: string };

export interface IndividualTeamInfo {
  ICPCEligible: boolean;
  competitionLevel: string;
  boersenEligible: boolean;
  degreeYear: number;
  degree: string;
  isRemote: boolean;
}


export interface MemberDetails {
  name: string;
  siteId: number;
  ICPCEligible: boolean;
  level: string;
  boersenEligible: boolean;
  isRemote: boolean
};

export enum Member {
  name = 0,
  siteId = 1,
  ICPCEligible = 2,
  level = 3,
  boersenEligible = 4,
  isRemote = 5,
}

export interface TeamMateData {
  teamMateEmail: string;
  teamMateName: string;
  teamMateICPCEmail: string;
  teamMateDegreeYear: number;
  teamMateDegree: string;
};


export class CompetitionService {
  private competitionRepository: CompetitionRepository;
  private userRepository: UserRepository;
  private notificationRepository: NotificationRepository;

  constructor(competitionRepository: CompetitionRepository, userRepository: UserRepository, notificationRepository: NotificationRepository) {
    this.competitionRepository = competitionRepository;
    this.userRepository = userRepository;
    this.notificationRepository = notificationRepository;
  }

  /**
   * Retrieves the competition sites associated with a given competition code.
   *
   * @param code The unique code representing the competition.
   * @returns A promise that resolves to the competition sites associated with the given competition code.
   */
  competitionSitesCodes = async (code: string) => {
    const compId = await this.competitionRepository.competitionIdFromCode(code);

    return await this.competitionSites(compId);
  };

  /**
   * Retrieves the competition sites for a given competition ID.
   *
   * @param compId The ID of the competition.
   * @returns A promise that resolves to the competition sites.
   */
  competitionSites = async (compId: number) => {
    return await this.competitionRepository.competitionSites(compId);
  };
  
  /**
   * Retrieves the roles of a user in a specific competition.
   *
   * @param userId The ID of the user whose roles are being retrieved.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to the roles of the user in the competition.
   */
  competitionRoles = async (userId: number, compId: number) => {
    return await this.competitionRepository.competitionRoles(userId, compId);
  };

  /**
   * Retrieves the details of a competition by its ID.
   *
   * @param competitionId - The ID of the competition to retrieve details for.
   * @returns A promise that resolves to the details of the competition.
   * @throws {ServiceError} If the competition ID is not provided or the competition is not found.
   */
  competitionGetDetails = async (competitionId: number): Promise<CompetitionInput> => {
    if (!competitionId) {
      throw new ServiceError(ServiceError.NotFound, 'Competition not found');
    }

    const competitionDetails = await this.competitionRepository.competitionGetDetails(competitionId);

    return competitionDetails;
  };

  /**
   * Retrieves a list of competitions that the user is a part of.
   *
   * @param userId The ID of the user for whom to retrieve the competitions.
   * @returns A promise that resolves to an array of CompetitionShortDetailsObject or undefined if no competitions are found.
   */
  competitionsList = async (userId: number): Promise<Array<CompetitionShortDetailsObject> | undefined> => {
    // Get user type for easier database queries
    const userTypeObject = await this.userRepository.userType(userId);

    const competitions = await this.competitionRepository.competitionsList(userId, userTypeObject.type);

    return competitions;
  };

  /**
   * Checks if a competition code is valid.
   * 
   * @param userId The ID of the user to check.
   * @param code The competition code to validate.
   * @returns An empty object if the user can register for the competition, or undefined.
   * @throws {COMPETITION_NOT_FOUND} - If the competition code does not correspond to any competition.
   * @throws {COMPETITION_USER_REGISTERED} - If the user is already registered as a participant or staff.
   */
  competitionCodeStatus = async (userId: number, code: string): Promise<{} | undefined> => {
    // const userTypeObject = await this.userRepository.userType(userId);
    // if (userTypeObject.type !== UserType.STUDENT) {
    //   throw COMPETITION_STUDENT_REQUIRED;
    // }

    const competitionId = await this.competitionRepository.competitionIdFromCode(code);
    if (!competitionId) {
      throw COMPETITION_NOT_FOUND;
    }

    const competitionRoles = await this.competitionRepository.competitionRoles(userId, competitionId);
    if (competitionRoles.length > 0) { // either they are already a participant or a staff
      throw COMPETITION_USER_REGISTERED;
    }

    return {};
  };

  /**
   * Retrieves the default site for a user in a competition based on their university.
   *
   * @param userId The ID of the user.
   * @param code The code of the competition.
   * @returns A promise that resolves to the default competition site object for the user's university, or undefined if not found.
   * @throws {ServiceError} If the competition is not found or the user is not associated with a university.
   */
  competitionUserDefaultSite = async (userId: number, code: string): Promise< CompetitionSiteObject | undefined> => {
    const competitionId = await this.competitionRepository.competitionIdFromCode(code);
    if (!competitionId) {
      throw new ServiceError(ServiceError.NotFound, 'Competition not found');
    }

    const university = await this.userRepository.userUniversity(userId);
    if (!university) {
      throw new ServiceError(ServiceError.NotFound, 'User is not associated with a university');
    }
    const defaultSite = await this.competitionRepository.competitionUniversityDefaultSite(competitionId, university);
    return defaultSite;
  };


  /**
   * Fetches the competition announcement for a given user and competition.
   *
   * @param userId The ID of the user.
   * @param compId The ID of the competition.
   * @param universityId The ID of the university (optional).
   * @returns A promise that resolves to an object containing the competition announcement, or undefined.
   * @throws {ServiceError} If the user does not belong to any university.
   */
  competitionAnnouncement = async (userId: number, compId: number, universityId: number | undefined): Promise<{} | undefined> => {
    let university: University = { id: 0, name: '' };
    if (!universityId) {
      university = await this.userRepository.userUniversity(userId);
      if (!university) {
        throw new ServiceError(ServiceError.NotFound, 'User not belong to any university');
      }
    }
    else {
      university.id = universityId;
    }
    let announcement = await this.competitionRepository.competitionAnnouncement(compId, university);
    return { announcement };
  };

  /**
   * Retrieves the competition ID associated with the given competition code.
   *
   * @param code The unique code of the competition.
   * @returns A promise that resolves to the competition ID.
   */
  competitionIdFromCode = async (code: string): Promise<number> => {
    return await this.competitionRepository.competitionIdFromCode(code);
  };
}