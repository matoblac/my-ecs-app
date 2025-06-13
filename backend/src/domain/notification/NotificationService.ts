import { Notification as DomainNotification } from './Notification'
import { NotificationRepository } from './NotificationRepository'
import { NotificationType } from './NotificationType'
import { v4 as uuid } from 'uuid'

export class NotificationService {
  constructor(private repo: NotificationRepository) {}

  async send(userId: string, message: string, type: NotificationType): Promise<DomainNotification> {
    const notification: DomainNotification = {
      id: uuid(),
      userId,
      message,
      type,
      createdAt: new Date(),
      read: false
    }

    await this.repo.save(notification)
    return notification
  }

  async getUserNotifications(userId: string): Promise<DomainNotification[]> {
    return this.repo.getByUserId(userId)
  }

  async markRead(notificationId: string): Promise<void> {
    return this.repo.markAsRead(notificationId)
  }

  async deleteNotification(notificationId: string): Promise<void> {
    return this.repo.delete(notificationId)
  }
}
