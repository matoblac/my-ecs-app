// src/domain/settings/Settings.ts
// Settings Entity

// A data structure for user settings

export interface Settings {
    userId: string
    theme?: 'light' | 'dark'
    language?: string
    notificationsEnabled?: boolean
    shareContext?: boolean
    updatedAt: Date
  }
  