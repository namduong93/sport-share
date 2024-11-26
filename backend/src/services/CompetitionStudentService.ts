import { StudentInfo } from '../../shared_types/Competition/student/StudentInfo.js';
import { ServiceError } from '../errors/ServiceError.js';
import { CompetitionUser, CompetitionUserRole } from '../models/competition/competitionUser.js';
import { UserType } from '../models/user/user.js';
import { CompetitionRepository } from '../repository/CompetitionRepository.js';
import { CompetitionStudentRepository } from '../repository/CompetitionStudentRepository.js';
import { NotificationRepository } from '../repository/NotificationRepository.js';
import { UserRepository } from '../repository/UserRepository.js';

export class CompetitionStudentService {
  private competitionRepository: CompetitionRepository;
  private competitionStudentRepository: CompetitionStudentRepository;
  private userRepository: UserRepository;
  private notificationRepository: NotificationRepository;
  
  constructor(competitionStudentRepository: CompetitionStudentRepository,
    competitionRepository: CompetitionRepository,
    userRepository: UserRepository, notificationRepository: NotificationRepository) {
    
    this.competitionStudentRepository = competitionStudentRepository;
    this.userRepository = userRepository;
    this.notificationRepository = notificationRepository;
    this.competitionRepository = competitionRepository;

  }

  /**
   * Retrieves the competition relevant fields enabled for a student registration in a competition.
   *
   * @param userId The ID of the user whose toggles are being retrieved.
   * @param code The code of the competition.
   * @returns A promise that resolves to an object containing the toggles for the student
   */
  competitionStudentsRegoToggles = async (userId: number, code: string) => {
    return await this.competitionStudentRepository.competitionStudentsRegoToggles(userId, code);
  };

  /**
    * Retrieves the details of a competition team for a given user.
    * 
    * @param userId The ID of the user requesting the team details.
    * @param compId The ID of the competition.
    * @returns A promise that resolves to the competition team details.
    * @throws {ServiceError} If the user is not a participant in the competition.
  */
  competitionTeamDetails = async (userId: number, compId: number) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth,
        'competition/team/details route is only for participants to use');
    }
    return await this.competitionStudentRepository.competitionTeamDetails(userId, compId);
  };

    
  /**
   * Generates an invite code for a team in a competition.
   *
   * @param userId The ID of the user requesting the invite code.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to the invite code for the team.
   * @throws {ServiceError} If the user is not a participant in the competition.
   */
  competitionTeamInviteCode = async (userId: number, compId: number) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth,
        'User is not a participant for this competition.');
    }
    return await this.competitionStudentRepository.competitionTeamInviteCode(userId, compId);
  };

  /**
   * Allows a user to join a competition team using a team code.
   * 
   * @param userId The ID of the user attempting to join the team.
   * @param compId The ID of the competition.
   * @param teamCode The code of the team the user is attempting to join.
   * @returns A promise that resolves when the user successfully joins the team.
   * @throws {ServiceError} If the user is not a participant in the competition.
   * @throws {ServiceError} If the user is not part of a university.
   */
  competitionTeamJoin = async (userId: number, compId: number, teamCode: string) => { 
    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth,
        'User is not a participant for this competition.');
    }
    const university = await this.userRepository.userUniversity(userId);
    if (!university) {
      throw new ServiceError(ServiceError.NotFound, 'User is not a part of an university');
    }
    return await this.competitionStudentRepository.competitionTeamJoin(userId, compId, teamCode, university);
  };

  /**
   * Retrieves the details of a student participating in a competition.
   *
   * @param userId The ID of the user.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to the competition student details.
   * @throws {ServiceError} If the user is not a participant in the competition.
   */
  competitionStudentDetails = async (userId: number, compId: number) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth, 'User is not a participant for this competition.');
    }

    return await this.competitionStudentRepository.competitionStudentDetails(userId, compId);
  };

  competitionStudentDetailsUpdate = async (userId: number, compId: number, studentInfo: StudentInfo) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth, 'User is not a participant for this competition.');
    }

    return await this.competitionStudentRepository.competitionStudentDetailsUpdate(userId, compId, studentInfo);
  };

  /**
   * Allows a student to join a competition using a provided code.
   * 
   * @param code The code of the competition to join.
   * @param competitionUserInfo The information of the user attempting to join the competition.
   * @throws {ServiceError} If the user is not a student.
   * @throws {ServiceError} If the competition is not found.
   * @throws {ServiceError} If the user is already a participant or staff for the competition.
   * @throws {ServiceError} If the user's university is not found.
   * @throws {ServiceError} If the site location is not provided.
   * @returns {Promise<void>} A promise that resolves when the user has successfully joined the competition.
   */
  competitionStudentJoin = async (code: string, competitionUserInfo: CompetitionUser): Promise<void> => {
    const userTypeObject = await this.userRepository.userType(competitionUserInfo.userId);
    if (userTypeObject.type !== UserType.STUDENT) {
      throw new ServiceError(ServiceError.Auth, 'User is not a student.');
    }

    const competitionId = await this.competitionRepository.competitionIdFromCode(code);
    if (!competitionId) {
      throw new ServiceError(ServiceError.NotFound, 'Competition not found');
    }

    competitionUserInfo.competitionId = competitionId;
    const competitionRoles = await this.competitionRepository.competitionRoles(competitionUserInfo.userId, competitionId);
    if (competitionRoles.length > 0) { // either they are already a participant or a staff
      throw new ServiceError(ServiceError.Auth, 'User is already a participant or staff for this competition.');
    }
    competitionUserInfo.competitionRoles = [CompetitionUserRole.PARTICIPANT];

    const university = await this.userRepository.userUniversity(competitionUserInfo.userId);
    if (!university) {
      throw new ServiceError(ServiceError.NotFound, 'University not found');
    }

    if (!competitionUserInfo.siteLocation || !competitionUserInfo.siteLocation.id) {
      throw new ServiceError(ServiceError.NotFound, 'Site location not provided');
    }

    await this.competitionStudentRepository.competitionStudentJoin(competitionUserInfo, university);

    // Send a welcome notification to the user
    const compId = await this.competitionRepository.competitionIdFromCode(code);
    await this.notificationRepository.notificationWelcomeToCompetition(competitionUserInfo.userId, compId);
    
    return;
  };

  /**
   * Withdraws a student from a competition.
   *
   * @param userId The ID of the user to withdraw.
   * @param compId The ID of the competition to withdraw from.
   * @returns A promise that resolves to the competition code if the withdrawal is successful, or undefined otherwise.
   * @throws {ServiceError} If the user is not a student or not a participant in the competition.
   */
  competitionStudentWithdraw = async (userId: number, compId: number): Promise<string | undefined> => {
    // Check if user is a student or a participant
    const userTypeObject = await this.userRepository.userType(userId);
    if (userTypeObject.type !== UserType.STUDENT) {
      throw new ServiceError(ServiceError.Auth, 'User is not a student.');
    }

    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth, 'User is not a participant for this competition.');
    }

    // Remove student from competition
    const result = await this.competitionStudentRepository.competitionStudentWithdraw(userId, compId);

    // Notify team members and coach
    await this.notificationRepository.notificationWithdrawal(userId, compId, result.competitionName, result.teamId, result.teamName);

    return result.competitionCode;
  };

  /**
   * Requests a site change for a competition participant and notifies the coach.
   *
   * @param userId The ID of the user requesting the site change.
   * @param compId The ID of the competition.
   * @param newSiteId The ID of the new site being requested.
   * @returns A promise that resolves to an empty object or undefined.
   * @throws {ServiceError} If the user is not a student or not a participant in the competition.
   */
  competitionRequestSiteChange = async (userId: number, compId: number, newSiteId: number): Promise<{} | undefined> => {
    // Check if user is a participant
    const userTypeObject = await this.userRepository.userType(userId);
    if (userTypeObject.type !== UserType.STUDENT) {
      throw new ServiceError(ServiceError.Auth, 'User is not a student.');
    }

    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth, 'User is not a participant for this competition.');
    }

    // Request site ID change
    const teamId = await this.competitionStudentRepository.competitionRequestSiteChange(userId, compId, newSiteId);

    // Notify coach
    await this.notificationRepository.notificationRequestSiteChange(teamId, compId);

    return {};
  };
}