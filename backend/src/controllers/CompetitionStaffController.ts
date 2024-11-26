import { Request, Response } from 'express';
import { httpErrorHandler } from './controller_util/httpErrorHandler.js';
import { EditCourse, EditRego } from '../../shared_types/Competition/staff/Edit.js';
import { CompetitionStaffService } from '../services/CompetitionStaffService.js';
import { StaffInfo } from '../../shared_types/Competition/staff/StaffInfo.js';
import { StudentInfo } from '../../shared_types/Competition/student/StudentInfo.js';
import { TeamDetails } from '../../shared_types/Competition/team/TeamDetails.js';
import { Competition } from '../models/competition/competition.js';
import { CompetitionAccessLevel, CompetitionStaff } from '../models/competition/competitionUser.js';

export class CompetitionStaffController {
  private competitionStaffService: CompetitionStaffService;
  
  constructor(competitionStaffService: CompetitionStaffService) {
    this.competitionStaffService = competitionStaffService;
  }

  /**
   * Updates the courses for the registration of competition.
   */
  competitionStaffUpdateCourses = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query as { userId: string };
    const { compId, editCourse, universityId } = req.body as {
      compId: number, editCourse: EditCourse, universityId?: number
    };

    await this.competitionStaffService.competitionStaffUpdateCourses(
      parseInt(userId), compId, editCourse, universityId);
  });

  /**
   * Handles the request to fetch competition information for a specific user and competition.
   */
  competitionInformation = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query as { userId: string, compId: string };

    const compInfo = await this.competitionStaffService.competitionInformation(
      parseInt(userId), parseInt(compId));

    res.json({ compInfo });
  });


  /**
   * Updates the capacity of a competition site.
   */
  competitionSiteCapacityUpdate = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query as { userId: string };
    const { compId, siteId, capacity } = req.body as { compId: number, siteId: number, capacity: number };
    
    await this.competitionStaffService.competitionSiteCapacityUpdate(
      parseInt(userId), compId, capacity, siteId);

    res.json({});
  });

  /**
   * Updates the registration fields for a competition.
   */
  competitionStaffUpdateRegoToggles = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const { compId, regoFields, universityId } = req.body as {
      compId: number, regoFields: EditRego, universityId?: number
    };

    await this.competitionStaffService.competitionStaffUpdateRegoToggles(
      parseInt(userId as string), compId, regoFields, universityId);

    res.json({});
  });

  /**
   * Handles the request to get the registration fields for a competition.
   */
  competitionStaffRegoToggles = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId, universityId } = req.query;

    const regoFields = await this.competitionStaffService.competitionStaffRegoToggles(
      parseInt(userId as string), parseInt(compId as string), parseInt(universityId as string));

    res.json({ regoFields });
  });

  /**
   * Updates the details of a number of staff for a competition.
   */
  competitionStaffUpdate = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const staffList = req.body.staffList as Array<StaffInfo>;
    const compId = req.body.compId as number;

    await this.competitionStaffService.competitionStaffUpdate(parseInt(userId as string), staffList, compId);

    res.json({});
  });

  /**
   * Updates the details of a number of students for a competition.
   */
  competitionStudentsUpdate = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const studentList = req.body.studentList as Array<StudentInfo>;
    const compId = req.body.compId as number;

    await this.competitionStaffService.competitionStudentsUpdate(parseInt(userId as string), studentList, compId);

    res.json({});
  });

  /**
   * Updates the details of a number of teams in a competition.
   */
  competitionTeamsUpdate = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const teamList = req.body.teamList as Array<TeamDetails>;
    const compId = req.body.compId as number;

    await this.competitionStaffService.competitionTeamsUpdate(parseInt(userId as string), teamList, compId);
    res.json({});
  });

  /**
   * Handles the request to get the attendees of a competition.
   */
  competitionAttendees = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;

    const attendees = await this.competitionStaffService.competitionAttendees(
      parseInt(userId as string), parseInt(compId as string));

    res.json({ attendees });
  });


  /**
   * Handles the request to get the details of a competition staff member.
   */
  competitionStaffDetails = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;

    const staffDetails = await this.competitionStaffService.competitionStaffDetails(
      parseInt(userId as string), parseInt(compId as string));

    res.json({ staffDetails });
  });

  /**
   * Updates the details of a competition staff member.
   */
  competitionStaffDetailsUpdate = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const { compId } = req.body;
    const staffDetails = req.body.staffInfo as StaffInfo;
    await this.competitionStaffService.competitionStaffDetailsUpdate(
      parseInt(userId as string), parseInt(compId as string), staffDetails);
    res.json({});
  });

  /**
   * Handles the request to get competition staff by user ID and competition ID.
   */
  competitionStaff = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;
    const staff = await this.competitionStaffService.competitionStaff(
      parseInt(userId as string), parseInt(compId as string));

    res.json({ staff });
  });

  /**
   * Handles the request to get students participating in a competition.
   */
  competitionStudents = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;
    const students = await this.competitionStaffService.competitionStudents(
      parseInt(userId as string), parseInt(compId as string));

    res.json({ students });
  });


  /**
   * Handles the request to get the list of teams in a competition.
   */
  competitionTeams = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;

    const teamList = await this.competitionStaffService.competitionTeams(
      parseInt(userId as string), parseInt(compId as string));

    res.json({ teamList });
  });

  /**
   * Handles the creation of a new competition by a system admin.
   */
  competitionsSystemAdminCreate = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;

    const newCompetition: Competition = {
      name: req.body.name,
      createdDate: Date.now(),
      earlyRegDeadline: req.body.earlyRegDeadline !== 'Invalid Date' ? req.body.earlyRegDeadline : undefined,
      generalRegDeadline: req.body.generalRegDeadline,
      startDate: req.body.startDate,
      code: req.body.code,
      siteLocations: req.body.siteLocations,
      otherSiteLocations: req.body.otherSiteLocations,
      region: req.body.region,
    };

    const competitionId = await this.competitionStaffService.competitionSystemAdminCreate(Number(userId), newCompetition);

    res.json(competitionId);

    return;
  });

  /**
   * Updates competition details by system admin.
   */
  competitionSystemAdminUpdate = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const compId = req.query.compId as string;
    const newCompetitionDetails: Competition = {
      id: req.body.id,
      name: req.body.name,
      teamSize: req.body.teamSize,
      createdDate: Date.now(),
      earlyRegDeadline: req.body.earlyRegDeadline !== 'Invalid Date' ? req.body.earlyRegDeadline : undefined,
      generalRegDeadline: req.body.generalRegDeadline,
      startDate: req.body.startDate,
      siteLocations: req.body.siteLocations,
      otherSiteLocations: req.body.otherSiteLocations,
      code: req.body.code,
      region: req.body.region,
      information: req.body.information,
    };

    const competitionId = await this.competitionStaffService.competitionSystemAdminUpdate(Number(userId), newCompetitionDetails);

    res.json(competitionId);

    return;
  });

  /**
   * Approves team assignments for a competition.
   */
  competitionApproveTeamAssignment = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, approveIds } = req.body;
    const result = await this.competitionStaffService.competitionApproveTeamAssignment(Number(userId), Number(compId), approveIds);
    res.json(result);
    return;
  });

  /**
   * Handles a request to change a team's name in a competition.
   */
  competitionRequestTeamNameChange = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, newTeamName } = req.body;
    const result = await this.competitionStaffService.competitionRequestTeamNameChange(Number(userId), Number(compId), newTeamName);
    res.json(result);
    return;
  });

  /**
   * Approves or rejects team name change requests for a competition.
   */
  competitionApproveTeamNameChange = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, approveIds, rejectIds } = req.body;
    const result = await this.competitionStaffService.competitionApproveTeamNameChange(Number(userId), Number(compId), approveIds, rejectIds);
    res.json(result);
    return;
  });

  /**
   * Handles the approval or rejection of site changes for a competition.
   */
  competitionApproveSiteChange = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, approveIds, rejectIds } = req.body;
    const result = await this.competitionStaffService.competitionApproveSiteChange(Number(userId), Number(compId), approveIds, rejectIds);
    res.json(result);
  });


  /**
   * Handles the assignment of team seats in a competition.
   */
  competitionTeamSeatAssignments = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, seatAssignments } = req.body;
    const result = await this.competitionStaffService.competitionTeamSeatAssignments(Number(userId), Number(compId), seatAssignments);
    res.json(result);
  });

  /**
   * Registers teams for a competition.
   */
  competitionRegisterTeams = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, teamIds } = req.body;
    const result = await this.competitionStaffService.competitionRegisterTeams(Number(userId), Number(compId), teamIds);
    res.json(result);
  });

  /**
   * Handles the request for a user to join a competition as staff.
   */
  competitionStaffJoin = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const code = req.body.code;
    let competitionStaffInfo: CompetitionStaff = {
      userId: Number(userId),
      competitionRoles: req.body.staffRegistrationData.roles,
      accessLevel: CompetitionAccessLevel.PENDING,
      siteLocation: req.body.staffRegistrationData.site,
      competitionBio: req.body.staffRegistrationData.competitionBio
    };
    await this.competitionStaffService.competitionStaffJoin(String(code), competitionStaffInfo);
    res.json({});
    return;
  });

  /**
   * Handles the request to update the announcement for a competition.
   */
  competitionAnnouncementUpdate = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.query;
    const { compId, universityId } = req.body;
    const announcementMessage = req.body.announcementMessage;
    await this.competitionStaffService.competitionAnnouncementUpdate(
      parseInt(userId as string), parseInt(compId as string), announcementMessage, parseInt(universityId as string));
    res.json({});
    return;
  });

  /**
   * Handles the request to run the competition algorithm.
   */
  competitionAlgorithm = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    let userId = req.query.userId;
    const compId = req.body.compId;
    const teamParticipant = await this.competitionStaffService.competitionAlgorithm(Number(compId), Number(userId));
    res.json(teamParticipant);
    return;
  });

  /**
   * Handles the request to get the capacity of a competition site.
   */
  competitionSiteCapacity = httpErrorHandler(async (req: Request, res: Response) => {
    const compId = req.query.compId;
    const userId = req.query.userId as string;
    const ids = req.query.ids;
    const siteIds = typeof ids === 'string' ? ids.split(',').map(Number) : [];

    const site = await this.competitionStaffService.competitionSiteCapacity(
      parseInt(userId), parseInt(compId as string), siteIds.includes(0) ? [] : siteIds);

    res.json({ site });
  });
}