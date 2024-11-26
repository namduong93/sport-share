import { Request, Response } from 'express';
import { CompetitionService } from '../services/CompetitionService.js';
import { httpErrorHandler } from './controller_util/httpErrorHandler.js';

export class CompetitionController {
  private competitionService: CompetitionService;
  
  constructor(competitionService: CompetitionService) {
    this.competitionService = competitionService;
  }

  /**
   * Handles the request to get competition site codes based on the provided code query parameter.
   */
  competitionSitesCodes = httpErrorHandler(async (req: Request, res: Response) => {
    const { code } = req.query;

    const sites = await this.competitionService.competitionSitesCodes(code as string);

    res.json({ sites });
  });

  /**
   * Handles the request to get competition sites based on the competition ID.
   */
  competitionSites = httpErrorHandler(async (req: Request, res: Response) => {
    const { compId } = req.query;

    const sites = await this.competitionService.competitionSites(parseInt(compId as string));

    res.json({ sites });
  });


  /**
   * Handles the request to get competition details by competition ID.
   */
  competitionGetDetails = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const competitionId = req.query.compId;
    let compId : number;

    if (Number.isNaN(Number(competitionId))) {
      compId = await this.competitionService.competitionIdFromCode(String(competitionId));
    } else {
      compId = Number(competitionId);
    }
    
    const competitionDetails = await this.competitionService.competitionGetDetails(compId);
    
    res.json({competition: competitionDetails});

    return;
  });

  /**
   * Handles the request to get a list of competitions that the user is a part of.
   */
  competitionsList = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;

    const competitions = await this.competitionService.competitionsList(Number(userId));

    res.json({ competitions: competitions });
    return;
  });

  /**
   * Handles the request to verify a competition code.
   */
  competitionCodeStatus = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId, code } = req.query;
    const codeStatus = await this.competitionService.competitionCodeStatus(Number(userId), String(code));
    res.json(codeStatus);
    return;
  });

  /**
   * Handles the request to get the default site for a competition user.
   */
  competitionUserDefaultSite = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId, code } = req.query;
    const defaultSite = await this.competitionService.competitionUserDefaultSite(Number(userId), String(code));
    res.json({ site: defaultSite });
    return;
  });
  
  /**
   * Handles the request to get the announcement for a competition.
   */
  competitionAnnouncement = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId, compId, universityId } = req.query;
    const announcement = await this.competitionService.competitionAnnouncement(
      parseInt(userId as string), parseInt(compId as string), parseInt(universityId as string));

    res.json(announcement);
    return;
  });

  /**
   * Handles the request to get competition roles for a user in a specific competition.
   */
  competitionRoles = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;
    const roles = await this.competitionService.competitionRoles(
      parseInt(userId as string), parseInt(compId as string));

    res.json({ roles });
  });
}