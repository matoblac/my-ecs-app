// src/tests/unit/domain/settings/SettingsService.test.ts

// Settings Service Tests

import { SettingsService } from '../../../../src/domain/settings/SettingsService'
import { SettingsRepository } from '../../../../src/domain/settings/SettingsRepository'
import { Settings } from '../../../../src/domain/settings/Settings'
import { expect, jest, beforeEach, describe, it } from '@jest/globals'

// Test suite for Settings Service

describe('SettingsService', () => {
  let repo: jest.Mocked<SettingsRepository>
  let service: SettingsService

  // Setup before each test

  beforeEach(() => {
    repo = {
      getByUserId: jest.fn(),
      save: jest.fn()
    }
    service = new SettingsService(repo)
  })

  // Test for returning existing settings if found

  it('returns existing settings if found', async () => {
    const existing: Settings = {
      userId: 'u1',
      theme: 'light',
      language: 'en',
      notificationsEnabled: true,
      shareContext: false,
      updatedAt: new Date()
    }
    repo.getByUserId.mockResolvedValue(existing)

    const result = await service.getUserSettings('u1')

    expect(result).toEqual(existing)
    expect(repo.save).not.toHaveBeenCalled()
  })

  // Test for creating default settings if none exist

  it('creates default settings if none exist', async () => {
    repo.getByUserId.mockResolvedValue(null)

    const result = await service.getUserSettings('u2')

    expect(result.userId).toBe('u2')
    expect(result.theme).toBe('dark')
    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'u2',
      theme: 'dark'
    }))
  })

  // Test for updating and saving settings correctly

  it('updates and saves settings correctly', async () => {
    const existing: Settings = {
      userId: 'u3',
      theme: 'dark',
      language: 'en',
      notificationsEnabled: true,
      shareContext: false,
      updatedAt: new Date()
    }
    repo.getByUserId.mockResolvedValue(existing)

    const result = await service.updateUserSettings('u3', {
      theme: 'light',
      notificationsEnabled: false
    })

    expect(result.theme).toBe('light')
    expect(result.notificationsEnabled).toBe(false)
    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'u3',
      theme: 'light',
      notificationsEnabled: false
    }))
  })
})