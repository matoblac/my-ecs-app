import { TeamRepository } from "../../../domain/team/TeamRepository";
import { Team } from "../../../domain/team/Team";
import { AuroraDataSource } from "./AuroraSource";
import { DatabaseError } from "../../../utils/errors";

export class TeamRepositoryAurora implements TeamRepository {
  constructor(private db: AuroraDataSource) {}

  // Initialize table (called once)
  private initialized = false;
  private async init(): Promise<void> {
    if (this.initialized) return;
    try {
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS teams (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          owner_id TEXT NOT NULL,
          member_ids TEXT, -- store as comma-separated for now, or json if preferred
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      this.initialized = true;
    } catch (err) {
      throw new DatabaseError("Failed to initialize teams table", err);
    }
  }

  // Save or update a team
  async save(team: Team): Promise<void> {
    await this.init();
    try {
      await this.db.execute(
        `
        INSERT INTO teams (id, name, owner_id, member_ids, created_at)
        VALUES (:id, :name, :owner_id, :member_ids, :created_at)
        ON CONFLICT(id) DO UPDATE SET
          name = EXCLUDED.name,
          owner_id = EXCLUDED.owner_id,
          member_ids = EXCLUDED.member_ids
        `,
        [
          { name: "id", value: { stringValue: team.id } },
          { name: "name", value: { stringValue: team.name } },
          { name: "owner_id", value: { stringValue: team.ownerId } },
          { name: "member_ids", value: { stringValue: (team.memberIds || []).join(",") } },
          { name: "created_at", value: { stringValue: team.createdAt.toISOString() } }
        ]
      );
    } catch (err) {
      throw new DatabaseError("Failed to save team", err);
    }
  }

  // Get by team ID
  async getById(id: string): Promise<Team | null> {
    await this.init();
    try {
      const result = await this.db.execute(
        `SELECT id, name, owner_id, member_ids, created_at FROM teams WHERE id = :id`,
        [{ name: "id", value: { stringValue: id } }]
      );
      if (!result.records || !result.records[0]) return null;
      return this.toTeam(result.records[0]);
    } catch (err) {
      throw new DatabaseError("Failed to fetch team", err);
    }
  }

  // List teams for a user (owner or member)
  async getTeamsForUser(userId: string): Promise<Team[]> {
    await this.init();
    try {
      // This is simple, not optimized for large sets. Adjust if you use JSONB/array for member_ids.
      const result = await this.db.execute(
        `SELECT id, name, owner_id, member_ids, created_at FROM teams WHERE owner_id = :userId OR member_ids LIKE :memberLike`,
        [
          { name: "userId", value: { stringValue: userId } },
          { name: "memberLike", value: { stringValue: `%${userId}%` } }
        ]
      );
      return (result.records || []).map(this.toTeam);
    } catch (err) {
      throw new DatabaseError("Failed to list teams for user", err);
    }
  }

  // Remove (delete) a team
  async delete(id: string): Promise<void> {
    await this.init();
    try {
      await this.db.execute(
        `DELETE FROM teams WHERE id = :id`,
        [{ name: "id", value: { stringValue: id } }]
      );
    } catch (err) {
      throw new DatabaseError("Failed to delete team", err);
    }
  }

  // Row to Team entity
  private toTeam = (row: any): Team => ({
    id: AuroraDataSource.getFieldValue(row[0]),
    name: AuroraDataSource.getFieldValue(row[1]),
    ownerId: AuroraDataSource.getFieldValue(row[2]),
    memberIds: (AuroraDataSource.getFieldValue(row[3]) || "")
      .split(",")
      .filter((id: string) => id),
    createdAt: new Date(AuroraDataSource.getFieldValue(row[4]))
  });
}
