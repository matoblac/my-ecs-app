// domain/user/UserRepository.ts
// how to find, create, update, delete users.
// utilized by the UserService.

import { User } from './User';


export interface UserRepository {
  save(user: User): Promise<void>;
  getById(userId: string): Promise<User | null>;
}
