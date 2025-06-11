// domain/user/User.ts
// Core user entity.

export interface User {
    id: string;
    email: string;
    displayName?: string;
    teamId?: string; // Optional for solo users
    createdAt: Date;
}
  