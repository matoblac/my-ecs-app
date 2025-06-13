// MCP Repository
// src/domain/mcp/MCPRepositary.ts
import { MCP } from "./MCP"
// Interface for saving & fetching MCPs



export interface MCPRepository {
  save(mcp: MCP): Promise<void>
  getById(id: string): Promise<MCP | null>
  getAll(): Promise<MCP[]>
  update(mcp: MCP): Promise<void>
  delete(id: string): Promise<void>
}