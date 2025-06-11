// src/domain/user/UserService.ts
// joining/leaving teams, etc.

import { User } from './User'
import { UserRepository } from './UserRepository'

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async registerUser(email: string): Promise<User> {
    const user: User = {
      id: this.generateId(),
      email,
      teamId: undefined,
      createdAt: new Date()
    }

    await this.repo.save(user)
    return user
  }

  async assignToTeam(userId: string, teamId: string): Promise<void> {
    const user = await this.repo.getById(userId)
    if (!user) throw new Error(`User not found: ${userId}`)

    user.teamId = teamId
    await this.repo.save(user)
  }

  private generateId(): string {
    return crypto.randomUUID()
  }
}
