import { Request, Response } from 'express';
import { CompetitionStudentService } from '../services/CompetitionStudentService.js';
import { httpErrorHandler } from './controller_util/httpErrorHandler.js';
import { StudentInfo } from '../../shared_types/Competition/student/StudentInfo.js';


export class CompetitionStudentController {
  private competitionStudentService: CompetitionStudentService;
  
  constructor(competitionStudentService: CompetitionStudentService) {
    this.competitionStudentService = competitionStudentService;
  }

  /**
   * Handles the request to retrieve the competition relevant fields enabled for a student registration in a competition.
   */
  competitionStudentsRegoToggles = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, code } = req.query;
    const regoFields = await this.competitionStudentService.competitionStudentsRegoToggles(
      parseInt(userId as string), code as string);

    res.json({ regoFields });
  });

  /**
   * Handles the request to get the details of a team in a competition.
   */
  competitionTeamDetails = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;

    const teamDetails = await this.competitionStudentService.competitionTeamDetails(
      parseInt(userId as string), parseInt(compId as string));

    res.json(teamDetails);
  });

  /**
   * Handles the request to generate an invite code for a competition team.
   */
  competitionTeamInviteCode = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;
    
    const inviteCode = await this.competitionStudentService.competitionTeamInviteCode(
      parseInt(userId as string), parseInt(compId as string));

    res.json({ code: inviteCode });
  });

  /**
   * Handles the request to get student details for a specific competition.
   */
  competitionStudentDetails = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;

    const studentDetails = await this.competitionStudentService.competitionStudentDetails(
      parseInt(userId as string), parseInt(compId as string));

    res.json({ studentDetails });
  });

  /**
   * Handles the request to update student details for a specific competition.
   */
  competitionStudentDetailsUpdate = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const { compId } = req.body;
    const studentDetails = req.body.studentDetails as StudentInfo;
    await this.competitionStudentService.competitionStudentDetailsUpdate(
      parseInt(userId as string), parseInt(compId as string), studentDetails);
  });

  /**
    * Handles the request to join a competition team by a user.
    */
  competitionTeamJoin = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const { compId, teamCode } = req.body;

    const teamId = await this.competitionStudentService.competitionTeamJoin(Number(userId), Number(compId), String(teamCode));

    res.json({ teamName: teamId.teamName });
  });

  /**
   * Handles the request for a student to join a competition by code.
   */
  competitionStudentJoin = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const code = req.body.code;
    const competitionUserInfo = req.body.competitionUser;
    competitionUserInfo.userId = Number(req.query.userId);
    await this.competitionStudentService.competitionStudentJoin(String(code), competitionUserInfo);
    res.json({});
    return;
  });

  /**
   * Handles the withdrawal of a student from a competition.
   */
  competitionStudentWithdraw = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const compId = req.body.compId;
    const result = await this.competitionStudentService.competitionStudentWithdraw(Number(userId), Number(compId));
    res.json(result);
    return;
  });

  /**
   * Handles the request to change the site of a competition for a user.
   */
  competitionRequestSiteChange = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, newSiteId } = req.body;
    const result = await this.competitionStudentService.competitionRequestSiteChange(Number(userId), Number(compId), Number(newSiteId));
    res.json(result);
  });
}