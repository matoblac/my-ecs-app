// src/domain/team/TeamService.ts

import { Team } from "./Team";

// Logic to create, update, and delete teams
// Referenced from UserService.ts to manage team membership and permissions

export interface TeamService {
    createTeam(ownerId: string, name: string): Promise<Team>;
    updateTeam(team: Team): Promise<Team>;
    deleteTeam(id: string): Promise<void>;
    addMember(teamId: string, userId: string): Promise<void>;
    removeMember(teamId: string, userId: string): Promise<void>;
}