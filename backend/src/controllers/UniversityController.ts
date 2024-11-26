import { Request, Response } from 'express';
import { httpErrorHandler } from './controller_util/httpErrorHandler.js';
import { UniversityService } from '../services/UniversityService.js';

export class UniversityController {
  private universityService: UniversityService;
  
  constructor(universityService: UniversityService) {
    this.universityService = universityService;
  }

  /**
   * Handles the request to retrieve university courses for a specific user.
   */
  universityCourses = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, code } = req.query as { userId: string, code: string };
    const courses = await this.universityService.universityCourses(parseInt(userId), code);

    res.json({ courses });
    return;
  });

  /**
   * Handles the request to get the list of universities.
   */
  universitiesList = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    let universitiesList = await this.universityService.universitiesList();
    res.json(universitiesList);
    return;
  });
}