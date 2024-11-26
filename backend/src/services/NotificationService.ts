import { Notification } from '../models/notification/notification.js';
import { SeatAssignment } from '../models/team/team.js';
import { UserType } from '../models/user/user.js';
import { NotificationRepository } from '../repository/NotificationRepository.js';
import { UserRepository } from '../repository/UserRepository.js';

export class NotificationService {
  private notificationRepository: NotificationRepository;
  private userRepository: UserRepository;

  constructor(notificationRepository: NotificationRepository, userRepository: UserRepository) {
    this.notificationRepository = notificationRepository;
    this.userRepository = userRepository;
  }

  /**
   * Removes a notification by its ID.
   *
   * @param notificationId The ID of the notification to be removed.
   * @returns A promise that resolves to an empty object upon successful removal.
   */
  notificationRemove = async (notificationId: number): Promise<{}> => {
    return await this.notificationRepository.notificationRemove(notificationId);
  };

  /**
   * Retrieves a list of notifications for a specific user.
   * 
   * If the user is a system admin, it also fetches notifications for pending staff approval.
   * 
   * @param userId The ID of the user whose notifications are to be retrieved.
   * @returns A promise that resolves to an array of notifications or undefined if no notifications are found.
   */
  userNotificationsList = async (userId: number): Promise<Notification[] | undefined> => {
    // Fetch admin notifications for pending staff approval if user is a system admin
    const userTypeObject = await this.userRepository.userType(userId);
    if (userTypeObject.type === UserType.SYSTEM_ADMIN) {
      await this.notificationRepository.notificationPendingStaffApproval(userId);
    }
    
    const result = this.notificationRepository.userNotificationsList(userId);

    return result;
  };

  /**
   * Sends notifications for team seat assignments.
   *
   * @param compId The ID of the competition.
   * @param seatAssignments An array of seat assignments.
   * @returns A promise that resolves to an empty object.
   */
  notificationTeamSeatAssignments = async (compId: number, seatAssignments: Array<SeatAssignment>): Promise<{}> => {
    return await this.notificationRepository.notificationTeamSeatAssignments(compId, seatAssignments);
  };
}