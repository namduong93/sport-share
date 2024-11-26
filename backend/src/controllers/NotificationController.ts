import { Request, Response } from 'express';
import { NotificationService } from '../services/NotificationService.js';
import { httpErrorHandler } from './controller_util/httpErrorHandler.js';

export class NotificationController {
  private notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  /**
   * Handles the removal of a notification.
   */
  notificationRemove = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const notificationId = req.query.notificationId;
    const result = await this.notificationService.notificationRemove(Number(notificationId));
    res.json(result);

    return;
  });

  /**
   * Handles the request to get the list of notifications for a user.
   */
  userNotificationsList = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const notifications = await this.notificationService.userNotificationsList(Number(userId));
    res.json(notifications);
    return;
  });

  /**
   * Handles the request to send notifications for team seat assignments.
   */
  notificationTeamSeatAssignments = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const { compId, seatAssignments } = req.body;
    await this.notificationService.notificationTeamSeatAssignments(Number(compId), seatAssignments);
    res.json({});
    return;
  });
}