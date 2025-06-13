// src/domain/user/UserService.ts
// joining/leaving teams, etc.



import { User } from './User'
import { UserRepository } from './UserRepository'

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  // Register a new user
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

  // send onboarding notification to user

  // Assign a user to a team
  async assignToTeam(userId: string, teamId: string): Promise<void> {
    const user = await this.repo.getById(userId)
    if (!user) throw new Error(`User not found: ${userId}`)

    user.teamId = teamId
    await this.repo.save(user)
  }

  // Leave a team
  async leaveTeam(userId: string): Promise<void> {
    const user = await this.repo.getById(userId)
    if (!user) throw new Error(`User not found: ${userId}`)
    user.teamId = undefined
    await this.repo.save(user)
  }

  // Get a user by id
  async getUserById(userId: string): Promise<User> { 
    const user = await this.repo.getById(userId)
    if (!user) throw new Error(`User not found: ${userId}`)
    return user
  }

  // Generate a random id to make sure the 
  // user id is idempotent
  private generateId(): string {
    return crypto.randomUUID()
  }
}
