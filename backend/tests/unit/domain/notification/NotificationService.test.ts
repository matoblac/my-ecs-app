// tests/unit/domain/notification/NotificationService.test.ts

import { NotificationService } from '../../../../src/domain/notification/NotificationService'
import { NotificationRepository } from '../../../../src/domain/notification/NotificationRepository'
import { Notification } from '../../../../src/domain/notification/Notification'
import { NotificationType } from '../../../../src/domain/notification/NotificationType'
import { expect, jest, beforeEach, describe, it } from '@jest/globals'

describe('NotificationService', () => {
  let repo: jest.Mocked<NotificationRepository>
  let service: NotificationService

  beforeEach(() => {
    repo = {
      save: jest.fn(),
      getByUserId: jest.fn(),
      markAsRead: jest.fn(),
      delete: jest.fn()
    }
    service = new NotificationService(repo)
  })

  it('sends a notification', async () => {
    await service.send('u1', 'Welcome!', NotificationType.SYSTEM)

    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'u1',
      message: 'Welcome!',
      read: false
    }))
  })

  it('gets user notifications', async () => {
    const notifs: Notification[] = [
      { id: 'n1', userId: 'u1', message: 'Msg1', type: NotificationType.SYSTEM, read: false, createdAt: new Date() }
    ]
    repo.getByUserId.mockResolvedValue(notifs)

    const result = await service.getUserNotifications('u1')

    expect(result).toEqual(notifs)
    expect(repo.getByUserId).toHaveBeenCalledWith('u1')
  })

  it('marks a notification as read', async () => {
    await service.markRead('n1')

    expect(repo.markAsRead).toHaveBeenCalledWith('n1')
  })

  it('deletes a notification', async () => {
    await service.deleteNotification('n1')

    expect(repo.delete).toHaveBeenCalledWith('n1')
  })
})
