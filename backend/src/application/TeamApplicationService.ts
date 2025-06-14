// backend/src/application/TeamApplicationService.ts

import { TeamService } from "../domain/team/TeamService";
import { UserService } from "../domain/user/UserService";
import { NotificationService } from "../domain/notification/NotificationService";
import { TeamRepository } from "../domain/team/TeamRepository";
import { NotificationType } from "../domain/notification/NotificationType";
import { NotFoundError } from "../utils/errors";

export class TeamApplicationService {
  constructor(
    private teamService: TeamService,
    private userService: UserService,
    private notificationService: NotificationService,
    private teamRepo: TeamRepository
  ) {}

  // Create a new team
  async createTeam(ownerId: string, name: string) {
    // Optionally check if user exists, is allowed, etc.
    const team = await this.teamService.createTeam(ownerId, name);
    return team;
  }

  // Add a member (by userId) to a team
  async addMember(teamId: string, userId: string) {
    const team = await this.teamRepo.getById(teamId);
    if (!team) throw new NotFoundError("Team");
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundError("User");

    await this.teamService.addMember(teamId, userId);

    // Send notification to the new member
    await this.notificationService.send(
      userId,
      `You have been added to team ${team.name}`,
      NotificationType.SYSTEM
    );
    return { success: true };
  }

  // Remove a member from a team
  async removeMember(teamId: string, userId: string) {
    await this.teamService.removeMember(teamId, userId);
    // Optionally notify user
    return { success: true };
  }

  // List teams for a user
  async getTeamsForUser(userId: string) {
    return this.teamRepo.getTeamsForUser(userId);
  }

  // Get full team details
  async getTeamDetails(teamId: string) {
    const team = await this.teamRepo.getById(teamId);
    if (!team) throw new NotFoundError("Team");
    // Optionally load members, permissions, etc.
    return team;
  }

  // Broadcast notification to all team members
  async broadcastToTeam(teamId: string, message: string, type: NotificationType = NotificationType.SYSTEM) {
    const team = await this.teamRepo.getById(teamId);
    if (!team) throw new NotFoundError("Team");
    for (const memberId of team.memberIds) {
      await this.notificationService.send(memberId, message, type);
    }
    return { success: true };
  }
}
