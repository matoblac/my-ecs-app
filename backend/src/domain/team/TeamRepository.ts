// src/domain/team/TeamRepository.ts
import { Team } from "./Team";

// Interface for Team Repository
// Referenced from UserService.ts to interface with teams

// The TeamRepository interface defines the contract for persistence operations on teams.
export interface TeamRepository {
    save(team: Team): Promise<void>;
    getById(id: string): Promise<Team | null>;
    getTeamsForUser(userId: string): Promise<Team[]>;
    delete(id: string): Promise<void>;
}
  
  