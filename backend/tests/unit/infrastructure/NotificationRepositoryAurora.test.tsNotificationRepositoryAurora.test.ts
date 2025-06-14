// tests/unit/infrastructure/NotificationRepositoryAurora.test.ts
import { NotificationRepositoryAurora } from '../../../src/infrastructure/database/aurora/NotificationRepositoryAurora'
import { AuroraDataSource } from '../../../src/infrastructure/database/aurora/AuroraSource'
import { Notification } from '../../../src/domain/notification/Notification'
import { NotificationType } from '../../../src/domain/notification/NotificationType'    
import { expect, jest, beforeEach, describe, it } from '@jest/globals'

describe('NotificationRepositoryAurora', () => {
    let mockDb: jest.Mocked<AuroraDataSource>
  
    beforeEach(() => {
      mockDb = { execute: jest.fn() } as any
      jest.clearAllMocks()
    })
  
    it('should save a notification', async () => {
      const repo = new NotificationRepositoryAurora(mockDb)
      mockDb.execute
        .mockResolvedValueOnce({ $metadata: {} } as any) // init
        .mockResolvedValueOnce({ $metadata: {} } as any) // save
  
      const notif: Notification = {
        id: 'n1',
        userId: 'u1',
        message: 'You have mail',
        type: NotificationType.SYSTEM,
        read: false,
        createdAt: new Date()
      }
      await expect(repo.save(notif)).resolves.not.toThrow()
      expect(mockDb.execute).toHaveBeenCalledTimes(2)
    })
  
    it('should return notifications for user', async () => {
      const repo = new NotificationRepositoryAurora(mockDb)
      mockDb.execute
        .mockResolvedValueOnce({ $metadata: {} } as any) // init
        .mockResolvedValueOnce({
          $metadata: {},
          records: [
            [
              { stringValue: 'n1' },
              { stringValue: 'u1' },
              { stringValue: 'msg' },
              { stringValue: 'system' },
              { booleanValue: false },
              { stringValue: new Date().toISOString() },
              { stringValue: new Date().toISOString() }
            ]
          ]
        } as any)
      const result = await repo.getByUserId('u1')
      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({ id: 'n1', userId: 'u1', type: 'system', read: false })
    })
  
    it('should mark a notification as read', async () => {
      const repo = new NotificationRepositoryAurora(mockDb)
      mockDb.execute
        .mockResolvedValueOnce({ $metadata: {} } as any) // init
        .mockResolvedValueOnce({ $metadata: {} } as any) // update
  
      await expect(repo.markAsRead('n1')).resolves.not.toThrow()
      expect(mockDb.execute).toHaveBeenCalledTimes(2)
    })
  
    it('should delete a notification', async () => {
      const repo = new NotificationRepositoryAurora(mockDb)
      mockDb.execute
        .mockResolvedValueOnce({ $metadata: {} } as any) // init
        .mockResolvedValueOnce({ $metadata: {} } as any) // delete
  
      await expect(repo.delete('n1')).resolves.not.toThrow()
      expect(mockDb.execute).toHaveBeenCalledTimes(2)
    })
  })