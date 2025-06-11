// tests/domain/user/UserService.test.ts
import { UserService } from '../../../../src/domain/user/UserService'
import { UserRepository } from '../../../../src/domain/user/UserRepository'
import { User } from '../../../../src/domain/user/User'


describe('UserService', () => {
  let repo: jest.Mocked<UserRepository>
  let service: UserService

  beforeEach(() => {
    repo = {
      save: jest.fn(),
      getById: jest.fn(),
    }
    service = new UserService(repo)
  })

  it('registers a new user', async () => {
    const result = await service.registerUser('alice@example.com')

    expect(result.email).toBe('alice@example.com')
    expect(result.teamId).toBeUndefined()
    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ email: 'alice@example.com' }))
  })

  it('assigns user to a team', async () => {
    const mockUser: User = { id: '123', email: 'a@b.com', teamId: undefined, createdAt: new Date() }
    repo.getById.mockResolvedValue(mockUser)

    await service.assignToTeam('123', 'team-xyz')

    expect(mockUser.teamId).toBe('team-xyz')
    expect(repo.save).toHaveBeenCalledWith(mockUser)
  })

  it('throws if user not found', async () => {
    repo.getById.mockResolvedValue(null)

    await expect(service.assignToTeam('missing', 'team-1')).rejects.toThrow('User not found: missing')
  })
})
