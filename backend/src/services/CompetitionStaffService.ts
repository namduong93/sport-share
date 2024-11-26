import { CompetitionSiteCapacity } from '../../shared_types/Competition/CompetitionSite.js';
import { EditCourse, EditRego } from '../../shared_types/Competition/staff/Edit.js';
import { StaffInfo } from '../../shared_types/Competition/staff/StaffInfo.js';
import { StudentInfo } from '../../shared_types/Competition/student/StudentInfo.js';
import { TeamDetails } from '../../shared_types/Competition/team/TeamDetails.js';
import { ServiceError } from '../errors/ServiceError.js';
import { Competition, CompetitionIdObject } from '../models/competition/competition.js';
import { CompetitionStaff, CompetitionUserRole } from '../models/competition/competitionUser.js';
import { SeatAssignment } from '../models/team/team.js';
import { University } from '../models/university/university.js';
import { UserType } from '../models/user/user.js';
import { CompetitionRepository } from '../repository/CompetitionRepository.js';
import { CompetitionStaffRepository } from '../repository/CompetitionStaffRepository.js';
import { NotificationRepository } from '../repository/NotificationRepository.js';
import { UserRepository } from '../repository/UserRepository.js';


export class CompetitionStaffService {
  private competitionStaffRepository: CompetitionStaffRepository;
  private competitionRepository: CompetitionRepository;
  private userRepository: UserRepository;
  private notificationRepository: NotificationRepository;
  
  constructor(
    competitionStaffRepository: CompetitionStaffRepository,
    competitionRepository: CompetitionRepository, userRepository: UserRepository, notificationRepository: NotificationRepository
  ) {
    this.competitionStaffRepository = competitionStaffRepository;
    this.competitionRepository = competitionRepository;
    this.userRepository = userRepository;
    this.notificationRepository = notificationRepository;
  }

  /**
   * Updates the courses for a given competition and university.
   * 
   * @param userId The ID of the user performing the update.
   * @param compId The ID of the competition.
   * @param editCourse An object containing the courses to be edited.
   * @param universityId The ID of the university.
   * 
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   * @throws {ServiceError} If the user is not an Admin or Coach.
   */
  competitionStaffUpdateCourses = async (userId: number, compId: number, editCourse: EditCourse, universityId?: number) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);

    if (!roles.includes(CompetitionUserRole.ADMIN)) {
      if (!roles.includes(CompetitionUserRole.COACH)) {
        throw new ServiceError(ServiceError.Auth, 'User is not an Admin or Coach');
      }

      universityId = await this.competitionRepository.getUserUniversityId(userId);
    }

    await this.competitionStaffRepository.competitionStaffUpdateCourses(compId, editCourse, universityId);
    return;
  };

  /**
   * Retrieves detailed information about a competition, including its general details
   * and associated site locations.
   *
   * @param userId The ID of the user requesting the competition information.
   * @param compId The ID of the competition to retrieve information for.
   * @returns {Promise<Object>} A promise that resolves to an object containing the competition's details.
   * @throws {ServiceError} If the user is not an Admin of the competition.
   */
  competitionInformation = async (userId: number, compId: number) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);

    if (!roles.includes(CompetitionUserRole.ADMIN)) {
      throw new ServiceError(ServiceError.Auth, 'User is not an Admin of this competition');
    }

    return await this.competitionStaffRepository.competitionInformation(compId);
  };

  /**
   * Updates the capacity of a competition site in the database.
   *
   * @param userId The ID of the user performing the update.
   * @param compId The ID of the competition.
   * @param siteId The ID of the competition site to update.
   * @param capacity The new capacity value to set for the competition site.
   * @returns {Promise<void>} A promise that resolves when the update operation is complete.
   * @throws {ServiceError} If the user is not an Admin or Site Coordinator.
   */
  competitionSiteCapacityUpdate = async (userId: number, compId: number, capacity: number, siteId?: number) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);

    if (!roles.includes(CompetitionUserRole.ADMIN)) {
      if (!roles.includes(CompetitionUserRole.SITE_COORDINATOR)) {
        throw new ServiceError(ServiceError.Auth, 'User is not an Admin or a Site Coordinator');
      }

      // (site Id can't be 0 btw cos it's a postgres SERIAL)
      !siteId && (siteId = await this.competitionStaffRepository.competitionGetCoordinatingSiteId(userId, siteId));
    }

    await this.competitionStaffRepository.competitionSiteCapacityUpdate(siteId, capacity);
    return;
  };

  /**
   * Update whether certain competitive programming relevant fields are enabled for registration for a competition site.
   *
   * @param userId The ID of the user performing the update.
   * @param compId The ID of the competition.
   * @param regoFields An object containing the fields to update.
   * @param universityId The ID of the university.
   * @returns {Promise<void>} A promise that resolves when the update operation is complete.
   * @throws {ServiceError} If the user is not an Admin or Coach.
   */
  competitionStaffUpdateRegoToggles = async (userId: number, compId: number, regoFields: EditRego, universityId: number) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);

    if (!roles.includes(CompetitionUserRole.ADMIN)) {
      if (!roles.includes(CompetitionUserRole.COACH)) {
        throw new ServiceError(ServiceError.Auth, 'User is not an Admin or a Coach');
      }

      await this.competitionStaffRepository.competitionCoachCheck(userId, compId);
    } else {

      if (!universityId) {
        throw new ServiceError(ServiceError.Auth, 'Admins need to provide a university id');
      }

      await this.competitionStaffRepository.competitionStaffUpdateRegoToggles(userId, compId, regoFields, universityId as number);
      return;
    }

    await this.competitionStaffRepository.competitionStaffUpdateRegoToggles(userId, compId, regoFields);
    return;
  };

  /**
   * Retrieve what competitive programming relevant fields are enabled for registration for a competition site.
   *
   * @param userId The ID of the user.
   * @param compId The ID of the competition.
   * @param universityId The ID of the university.
   * @returns {Promise<void>} A promise that resolves when the update operation is complete.
   * @throws {ServiceError} If the user is not an Admin or Coach.
   */
  competitionStaffRegoToggles = async (userId: number, compId: number, universityId?: number) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);

    if (!roles.includes(CompetitionUserRole.ADMIN)) {
      if (!roles.includes(CompetitionUserRole.COACH)) {

        throw new ServiceError(ServiceError.Auth, 'User is not an Admin or a Coach');
      }

      await this.competitionStaffRepository.competitionCoachCheck(userId, compId);


    } else {

      if (!universityId) {
        throw new ServiceError(ServiceError.Auth, 'Admins need to provide a university id');
      }

      return await this.competitionStaffRepository.competitionStaffRegoToggles(userId, compId, universityId as number);
    }

    return await this.competitionStaffRepository.competitionStaffRegoToggles(userId, compId);
  };

  /**
   * Updates the competition user details for a list of staff in a specific competition.
   *
   * @param userId The ID of the user making the request.
   * @param staffList An array of staff information to be updated.
   * @param compId The ID of the competition.
   * @throws {ServiceError} If the user is not an Admin for the competition.
   * @returns A promise that resolves when the update is complete.
   */
  competitionStaffUpdate = async (userId: number, staffList: StaffInfo[], compId: number) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);

    if (!roles.includes(CompetitionUserRole.ADMIN)) {
      throw new ServiceError(ServiceError.Auth, 'User is not an Admin for this competition');
    }

    const accessUpdatedStaff = await this.competitionStaffRepository.competitionStaffUpdate(userId, staffList, compId);
    for (const staff of accessUpdatedStaff) {
      // Send a welcome notification to the user
      await this.notificationRepository.notificationWelcomeToCompetition(staff, compId);
    }
    
    return;
  };

  /**
   * Updates the competition user details for a list of students in a specific competition.
   * 
   * @param userId The ID of the user performing the update.
   * @param studentList An array of student information objects to be updated.
   * @param compId The ID of the competition.
   * @throws {ServiceError} If the user is neither an Admin nor a Coach.
   * @returns A promise that resolves when the update is complete.
   */
  competitionStudentsUpdate = async (userId: number, studentList: StudentInfo[], compId: number) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.ADMIN)) {
      if (!roles.includes(CompetitionUserRole.COACH)) {
        throw new ServiceError(ServiceError.Auth, 'User is not an Admin or Coach');
      }

      await this.competitionStaffRepository.coachCheckIdsStudent(userId, studentList.map((student) => student.userId), compId);
    }

    await this.competitionStaffRepository.competitionStudentsUpdate(userId, studentList, compId);
    return;
  };

  /**
   * Updates the details of teams in a competition.
   *
   * @param userId The ID of the user making the request.
   * @param teamList An array of team details to be updated.
   * @param compId The ID of the competition.
   * @throws {ServiceError} If the user is not an Admin or Coach.
   * @returns A promise that resolves when the update is complete.
   */
  competitionTeamsUpdate = async (userId: number, teamList: TeamDetails[], compId: number) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.ADMIN)) {
      if (!roles.includes(CompetitionUserRole.COACH)) {
        throw new ServiceError(ServiceError.Auth, 'User is not an Admin or Coach');
      }

      await this.competitionStaffRepository.coachCheckIds(userId, teamList.map((team) => team.teamId), compId);

    }


    await this.competitionStaffRepository.competitionTeamsUpdate(teamList, compId);
    return;
  };

  /**
   * Retrieves the attendees of a competition for a given user.
   * 
   * @param userId The ID of the user requesting the attendees.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to the list of competition attendees.
   * @throws {ServiceError} If the user does not have the required role (SITE_COORDINATOR or ADMIN).
   */
  competitionAttendees = async (userId: number, compId: number) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.SITE_COORDINATOR) && !roles.includes(CompetitionUserRole.ADMIN)) {
      throw new ServiceError(ServiceError.Auth,
        'competition/attendees route is only for site coordinators and admins to use');
    }

    return await this.competitionStaffRepository.competitionAttendees(userId, compId);
  };

  competitionStaffDetails = async (userId: number, compId: number) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.ADMIN) && !roles.includes(CompetitionUserRole.COACH) && !roles.includes(CompetitionUserRole.SITE_COORDINATOR)) {
      throw new ServiceError(ServiceError.Auth, 'User is not a staff for this competition.');
    }

    return await this.competitionStaffRepository.competitionStaffDetails(userId, compId);
  };

  competitionStaffDetailsUpdate = async (userId: number, compId: number, staffInfo: StaffInfo) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.ADMIN) && !roles.includes(CompetitionUserRole.COACH) && !roles.includes(CompetitionUserRole.SITE_COORDINATOR)) {
      throw new ServiceError(ServiceError.Auth, 'User is not a staff for this competition.');
    }
    await this.competitionStaffRepository.competitionStaffDetailsUpdate(userId, compId, staffInfo);
  };

  /**
   * Retrieves the staff information for a specific competition.
   *
   * @param userId The ID of the user requesting the staff information.
   * @param compId The ID of the competition for which the staff information is requested.
   * @returns A promise that resolves to an array of StaffInfo objects.
   */
  competitionStaff = async (userId: number, compId: number): Promise<Array<StaffInfo>> => {
    return await this.competitionStaffRepository.competitionStaff(userId, compId);
  };

  /**
   * Retrieves a list of students participating in a specific competition.
   *
   * @param userId The ID of the user requesting the information.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to an array of `StudentInfo` objects.
   */
  competitionStudents = async (userId: number, compId: number): Promise<Array<StudentInfo>> => {
    return await this.competitionStaffRepository.competitionStudents(userId, compId);
  };

  /**
   * Retrieves the teams participating in a competition for a given user (staff).
   *
   * @param userId The ID of the user requesting the competition teams.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to the list of teams in the competition.
   */
  
  /**
   * Retrieves the teams participating in a competition for a given user (staff).
   *
   * @param userId The ID of the user requesting the competition teams.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to the list of teams in the competition.
   */
  competitionTeams = async (userId: number, compId: number) => {
    // Staff
    return await this.competitionStaffRepository.competitionTeams(userId, compId);
  };

  /**
   * Creates a new competition as a system administrator.
   *
   * @param userId The ID of the user attempting to create the competition.
   * @param competition The competition details to be created.
   * @returns A promise that resolves to an object containing the ID of the created competition.
   * @throws {ServiceError} If the user is not a system administrator.
   */
  competitionSystemAdminCreate = async (userId: number, competition: Competition): Promise<CompetitionIdObject> => {
    // Verify system admin
    const userTypeObject = await this.userRepository.userType(userId);

    if (userTypeObject.type !== UserType.SYSTEM_ADMIN) {
      throw new ServiceError(ServiceError.Auth, 'User is not a system admin.');
    }

    const competitionId = await this.competitionStaffRepository.competitionSystemAdminCreate(userId, competition);

    return competitionId;
  };

  /**
   * Updates a competition's details by a system admin.
   *
   * @param userId The ID of the user attempting to perform the update.
   * @param competition The competition object containing updated details.
   * @returns A promise that resolves to the updated competition ID or undefined.
   * @throws {ServiceError} If the user is not a system admin.
   */
  competitionSystemAdminUpdate = async (userId: number, competition: Competition): Promise<{} | undefined> => {
    // Verify system admin
    const userTypeObject = await this.userRepository.userType(userId);

    if (userTypeObject.type !== UserType.SYSTEM_ADMIN) {
      throw new ServiceError(ServiceError.Auth, 'User is not a system admin.');
    }

    const competitionId = await this.competitionStaffRepository.competitionSystemAdminUpdate(userId, competition);

    return competitionId;
  };

  /**
   * Approves team assignments for a competition and notifies team members.
   *
   * @param userId The ID of the user performing the approval.
   * @param compId The ID of the competition.
   * @param approveIds An array of team assignment IDs to approve.
   * @returns A promise that resolves to an empty object.
   */
  competitionApproveTeamAssignment = async (userId: number, compId: number, approveIds: Array<number>): Promise<{}> => {
    // Checks for if user is admin or coach is moved to repository layer

    // Approve team assignments
    await this.competitionStaffRepository.competitionApproveTeamAssignment(userId, compId, approveIds);

    // Notify team members
    await this.notificationRepository.notificationApproveTeamAssignment(compId, approveIds);

    return {};
  };

  /**
   * Requests a team name change for a competition and notifies the coach
   *
   * @param userId The ID of the user requesting the change.
   * @param compId The ID of the competition.
   * @param newTeamName The new team name being requested.
   * @returns A promise that resolves to an empty object or undefined.
   * @throws {ServiceError} If the user is not a student or not a participant in the competition.
   */
  competitionRequestTeamNameChange = async (userId: number, compId: number, newTeamName: string): Promise<{} | undefined> => {
    // Check if user is a participant
    const userTypeObject = await this.userRepository.userType(userId);
    if (userTypeObject.type !== UserType.STUDENT) {
      throw new ServiceError(ServiceError.Auth, 'User is not a student.');
    }

    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth, 'User is not a participant for this competition.');
    }

    // Request team name change
    const teamId = await this.competitionStaffRepository.competitionRequestTeamNameChange(userId, compId, newTeamName);

    // Notify coach
    await this.notificationRepository.notificationRequestTeamNameChange(teamId, compId);

    return {};
  };

  /**
   * Approves or rejects team name change requests for a competition and notifies team members.
   *
   * @param userId The ID of the user performing the action.
   * @param compId The ID of the competition.
   * @param approveIds An array of team IDs whose name change requests are approved.
   * @param rejectIds An array of team IDs whose name change requests are rejected.
   * @returns A promise that resolves to an empty object or undefined.
   */
  competitionApproveTeamNameChange = async (userId: number, compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{} | undefined> => {
    // Approve or reject team name change
    await this.competitionStaffRepository.competitionApproveTeamNameChange(userId, compId, approveIds, rejectIds);

    // Notify team members
    await this.notificationRepository.notificationApproveTeamNameChange(compId, approveIds, rejectIds);

    return {};
  };

  /**
   * Approves or rejects site ID changes for a competition and notifies team members.
   *
   * @param userId The ID of the user performing the action.
   * @param compId The ID of the competition.
   * @param approveIds An array of IDs to approve.
   * @param rejectIds An array of IDs to reject.
   * @returns A promise that resolves to an empty object or undefined.
   */
  competitionApproveSiteChange = async (userId: number, compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{} | undefined> => {
    // Approve or reject site ID change
    await this.competitionStaffRepository.competitionApproveSiteChange(userId, compId, approveIds, rejectIds);

    // Notify team members
    await this.notificationRepository.notificationApproveSiteChange(compId, approveIds, rejectIds);

    return {};
  };

  /**
   * Assigns seats to teams in a competition and sends notifications to the teams.
   *
   * @param userId The ID of the user performing the assignment.
   * @param compId The ID of the competition.
   * @param seatAssignments An array of seat assignments for the teams.
   * @returns A promise that resolves to an empty object or undefined.
   */
  competitionTeamSeatAssignments = async (userId: number, compId: number, seatAssignments: Array<SeatAssignment>): Promise<{} | undefined> => {
    // Assign seats to teams
    await this.competitionStaffRepository.competitionTeamSeatAssignments(userId, compId, seatAssignments);

    // Notifications to teams
    await this.notificationRepository.notificationTeamSeatAssignments(compId, seatAssignments);

    return {};
  };

  /**
   * Registers teams for a competition.
   *
   * @param userId The ID of the user performing the registration.
   * @param compId The ID of the competition.
   * @param teamIds An array of team IDs to be registered.
   * @returns A promise that resolves to an empty object or undefined.
   */
  competitionRegisterTeams = async (userId: number, compId: number, teamIds: Array<number>): Promise<{} | undefined> => {
    await this.competitionStaffRepository.competitionRegisterTeams(userId, compId, teamIds);
    return {};
  };


  /**
   * Adds a staff member to a competition based on the provided competition code and staff information.
   * 
   * @param code The unique code of the competition.
   * @param competitionStaffInfo An object containing information about the competition staff member.
   * @returns A promise that resolves to an empty object or undefined.
   * @throws {ServiceError} If the competition is not found.
   * @throws {ServiceError} If the user is not a staff member.
   * @throws {ServiceError} If the competition bio is not provided for a coach role.
   * @throws {ServiceError} If the user is not associated with a university.
   * @throws {ServiceError} If the site location, name, or capacity is not provided for a site coordinator role.
   */
  competitionStaffJoin = async (code: string, competitionStaffInfo: CompetitionStaff ): Promise<{} | undefined> => {
    const competitionId = await this.competitionRepository.competitionIdFromCode(code);
    if (!competitionId) {
      throw new ServiceError(ServiceError.NotFound, 'Competition not found');
    }

    let userType = await this.userRepository.userType(competitionStaffInfo.userId);
    if (userType.type === UserType.STUDENT) {
      throw new ServiceError(ServiceError.NotFound, 'User not staff');
    }

    if (competitionStaffInfo.competitionRoles.includes(CompetitionUserRole.COACH)) {
      if (!competitionStaffInfo.competitionBio) {
        throw new ServiceError(ServiceError.NotFound, 'Competition bio not provided');
      }

      const university = await this.userRepository.userUniversity(competitionStaffInfo.userId);
      if (!university) {
        throw new ServiceError(ServiceError.NotFound, 'User is not associated with this university');
      }

      competitionStaffInfo.university = university;
    }

    if (competitionStaffInfo.competitionRoles.includes(CompetitionUserRole.SITE_COORDINATOR)) {
      if (!competitionStaffInfo.siteLocation || !competitionStaffInfo.siteLocation.id) {
        throw new ServiceError(ServiceError.NotFound, 'Site location not provided');
      }

      if (!competitionStaffInfo.siteLocation.name) {
        throw new ServiceError(ServiceError.NotFound, 'Site name not provided');
      }

      if (!competitionStaffInfo.siteLocation.capacity) {
        throw new ServiceError(ServiceError.NotFound, 'Site capacity not provided');
      }
    }

    await this.competitionStaffRepository.competitionStaffJoin(competitionId, competitionStaffInfo);

    return {};
  };


  /**
   * Updates the competition announcement with the provided message.
   *
   * @param userId The ID of the user making the announcement.
   * @param compId The ID of the competition.
   * @param announcementMessage - The message to be announced.
   * @param universityId The ID of the university (optional).
   * @returns A promise that resolves when the announcement is updated.
   * @throws {ServiceError} If the user is not a coach or admin for the competition.
   * @throws {ServiceError} If the user does not belong to any university and no universityId is provided.
   */
  competitionAnnouncementUpdate = async (userId: number, compId: number, announcementMessage: string, universityId: number | undefined): Promise<void> => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.COACH) && !roles.includes(CompetitionUserRole.ADMIN)) {
      throw new ServiceError(ServiceError.Auth, 'User is not a coach for this competition.');
    }
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

    let announcement = {
      competitionId: compId,
      userId: userId,
      message: announcementMessage,
      universityId: university.id,
      createdAt: Date.now()
    };

    await this.competitionStaffRepository.competitionAnnouncementUpdate(compId, university, announcement);
  };

  /**
   * Executes the competition algorithm for a given competition.
   *
   * @param compId The ID of the competition.
   * @param userId The ID of the user.
   * @returns A promise that resolves to an object containing the teams participating in the competition.
   * @throws {ServiceError} If the competition is not found.
   * @throws {ServiceError} If the user is not a coach.
   */
  competitionAlgorithm = async (compId: number, userId: number): Promise<{}> => {
    const competition = await this.competitionRepository.competitionGetDetails(compId);
    if (!competition) {
      throw new ServiceError(ServiceError.NotFound, 'Competition not found');
    }
    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.COACH)) {
      throw new ServiceError(ServiceError.Auth, 'User is not a coach');
    }
    const teamsParticipating = await this.competitionStaffRepository.competitionAlgorithm(compId, userId);
    return teamsParticipating;
  };

  /**
   * Retrieves the capacity information for competition sites.
   *
   * @param userId The ID of the user requesting the information.
   * @param compId The ID of the competition.
   * @param siteIds Optional array of site IDs to get capacity information for. If not provided, the coordinating site ID for the user and competition will be used.
   * @returns A promise that resolves to an array of `CompetitionSiteCapacity` objects.
   */
  competitionSiteCapacity = async (userId: number, compId: number, siteIds?: number[]): Promise<Array<CompetitionSiteCapacity>> => {

    if (!siteIds.length) {
      siteIds = [await this.competitionStaffRepository.competitionGetCoordinatingSiteId(userId, compId)];
    }

    return await this.competitionRepository.competitionSiteCapacity(compId, siteIds);
  };
}