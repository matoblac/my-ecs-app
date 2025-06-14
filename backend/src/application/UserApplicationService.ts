import { UserService } from "../domain/user/UserService";
import { User } from "../domain/user/User";
import { NotFoundError } from "../utils/errors";
import { NotificationService } from "../domain/notification/NotificationService";
import { NotificationType } from "../domain/notification/NotificationType";

/**
 * Application Service for user-related operations.
 * Orchestrates user actions, transaction boundaries, and input validation.
 */
export class UserApplicationService {
    constructor(
      private readonly userService: UserService,
      private readonly notificationService: NotificationService
    ) {}
  
    /**
     * Registers a new user and sends an onboarding notification.
     */
    async registerUser(email: string): Promise<User> {
      const user = await this.userService.registerUser(email);
  
      // Optionally send a welcome notification via the notification domain
      await this.notificationService.send(
        user.id,
        "Welcome to Allen.ai! You're all set.",
        NotificationType.SYSTEM
      );
  
      return user;
    }
  
    /**
     * Assigns a user to a team (delegates to domain service).
     */
    async assignUserToTeam(userId: string, teamId: string): Promise<void> {
      await this.userService.assignToTeam(userId, teamId);
    }
  
    /**
     * Removes a user from their team (delegates to domain service).
     */
    async removeUserFromTeam(userId: string): Promise<void> {
      await this.userService.leaveTeam(userId);
    }
  
    /**
     * Gets a user by ID (returns NotFoundError if not found).
     */
    async getUser(userId: string): Promise<User> {
      try {
        return await this.userService.getUserById(userId);
      } catch (e) {
        // Consistent application-level error handling
        throw new NotFoundError(`User: ${userId}`);
      }
    }
  }