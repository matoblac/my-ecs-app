import { User } from './User';

export function canAccessSharedMemory(user: User): boolean {
    return Boolean(user.teamId);
}
  