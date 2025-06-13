// src/domain/settings/SettingsService.ts
// Settings Service

import { Settings } from './Settings'
import { SettingsRepository } from './SettingsRepository'

// A service to manage user settings

export class SettingsService {
    constructor(private repo: SettingsRepository) {}
  
    async getUserSettings(userId: string): Promise<Settings> {
      const existing = await this.repo.getByUserId(userId)
      if (existing) return existing
  
      const defaultSettings: Settings = {
        userId,
        theme: 'dark',
        language: 'en',
        notificationsEnabled: true,
        shareContext: false,
        updatedAt: new Date()
      }
      await this.repo.save(defaultSettings)
      return defaultSettings
    }
  
    async updateUserSettings(userId: string, changes: Partial<Settings>): Promise<Settings> {
      const current = await this.getUserSettings(userId)
      const updated: Settings = {
        ...current,
        ...changes,
        updatedAt: new Date()
      }
      await this.repo.save(updated)
      return updated
    }
}