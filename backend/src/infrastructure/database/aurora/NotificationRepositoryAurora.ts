// src/infrastructure/database/aurora/NotificationRepositoryAurora.ts
import { NotificationRepository } from '../../../domain/notification/NotificationRepository'
import { Notification } from '../../../domain/notification/Notification'
import { AuroraDataSource } from './AuroraSource'

export class NotificationRepositoryAurora implements NotificationRepository {
  private initialized = false

  constructor(private db: AuroraDataSource) {}

  private async init(): Promise<void> {
    if (this.initialized) return

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS user_notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `)

    this.initialized = true
  }

  async save(notification: Notification): Promise<void> {
    await this.init()
    
    try {
      await this.db.execute(
        `
        INSERT INTO user_notifications (id, user_id, message, type, read, created_at)
        VALUES (:id, :user_id, :message, :type, :read, :created_at)
        ON CONFLICT(id) DO UPDATE SET
          message = EXCLUDED.message,
          type = EXCLUDED.type,
          read = EXCLUDED.read,
          updated_at = CURRENT_TIMESTAMP
        `,
        [
          { name: 'id', value: { stringValue: notification.id } },
          { name: 'user_id', value: { stringValue: notification.userId } },
          { name: 'message', value: { stringValue: notification.message } },
          { name: 'type', value: { stringValue: notification.type } },
          { name: 'read', value: { booleanValue: notification.read } },
          { name: 'created_at', value: { stringValue: notification.createdAt.toISOString() } }
        ]
      )
    } catch (err) {
      console.error('DB Error saving notification:', err)
      throw err
    }
  }

  async getByUserId(userId: string): Promise<Notification[]> {
    await this.init()

    try {
      const result = await this.db.execute(
        `SELECT id, user_id, message, type, read, created_at, updated_at 
         FROM user_notifications 
         WHERE user_id = :user_id 
         ORDER BY created_at DESC`,
        [{ name: 'user_id', value: { stringValue: userId } }]
      )

      return (result.records || []).map(this.toNotification)
    } catch (err) {
      console.error('DB Error getting notifications for user:', err)
      throw err
    }
  }

  async markAsRead(id: string): Promise<void> {
    await this.init()

    await this.db.execute(
      `
      UPDATE user_notifications
      SET read = TRUE, updated_at = :updated_at
      WHERE id = :id
      `,
      [
        { name: 'id', value: { stringValue: id } },
        { name: 'updated_at', value: { stringValue: new Date().toISOString() } }
      ]
    )
  }

  async delete(id: string): Promise<void> {
    await this.init()

    await this.db.execute(
      `DELETE FROM user_notifications WHERE id = :id`,
      [{ name: 'id', value: { stringValue: id } }]
    )
  }

  private toNotification = (row: any): Notification => {
    const notification: Notification = {
      id: AuroraDataSource.getFieldValue(row[0]),
      userId: AuroraDataSource.getFieldValue(row[1]),
      message: AuroraDataSource.getFieldValue(row[2]),
      type: AuroraDataSource.getFieldValue(row[3]),
      read: AuroraDataSource.getFieldValue(row[4]),
      createdAt: new Date(AuroraDataSource.getFieldValue(row[5]))
    }

    // Add optional updatedAt if present
    const updatedAt = AuroraDataSource.getFieldValue(row[6])
    if (updatedAt) {
      notification.updatedAt = new Date(updatedAt)
    }

    return notification
  }
}
