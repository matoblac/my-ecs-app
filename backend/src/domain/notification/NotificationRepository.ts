import { Notification as DomainNotification } from './Notification'

export interface NotificationRepository {
    save(notification: DomainNotification): Promise<void>
    getByUserId(userId: string): Promise<DomainNotification[]>
    markAsRead(notificationId: string): Promise<void>
    delete(notificationId: string): Promise<void>
  }
  