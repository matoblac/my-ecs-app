// src/domain/team/Team.ts

// Interface for Team Entity 
// Referenced from UserService.ts to interface with teams

export interface Team {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}


