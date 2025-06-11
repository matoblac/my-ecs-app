// domain/user/UserSettings.ts
// user settings, preferences, etc.
// utilized by the UserService.

export interface UserSettings {
    userId: string;
    aiEnabled: boolean;
    notificationsEnabled: boolean;
    pseudonymize: boolean;
}
  