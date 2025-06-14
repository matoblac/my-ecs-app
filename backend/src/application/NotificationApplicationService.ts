// backend/src/application/NotificationApplicationService.ts

import { NotificationService } from "../domain/notification/NotificationService";
import { NotificationType } from "../domain/notification/NotificationType";

// This is the application service for the notification domain.
// It is responsible for sending notifications to users.
// It is also responsible for listing user notifications.
// It is also responsible for marking notifications as read.
// It is also responsible for deleting notifications.

export class NotificationApplicationService {
  constructor(private notificationService: NotificationService) {}

  async sendNotification(userId: string, message: string, type: NotificationType) {
    return this.notificationService.send(userId, message, type);
  }

  async listUserNotifications(userId: string) {
    return this.notificationService.getUserNotifications(userId);
  }

  async markNotificationRead(notificationId: string) {
    return this.notificationService.markRead(notificationId);
  }

  async deleteNotification(notificationId: string) {
    return this.notificationService.deleteNotification(notificationId);
  }
}
