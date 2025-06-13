// src/domain/settings/SettingsRepository.ts
// Settings Repository

import { Settings } from './Settings'

// An interface for saving & fetching settings

export interface SettingsRepository {
    getByUserId(userId: string): Promise<Settings | null>
    save(settings: Settings): Promise<void>
}