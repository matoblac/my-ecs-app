// src/domain/mcp/MCPService.ts
import { MCP } from './MCP'
import { MCPRepository } from './MCPRepository'
import { v4 as uuidv4 } from 'uuid'

// MCP Service
export class MCPService {
  constructor(private repo: MCPRepository) {}

  // Create a new MCP
  async createMCP(data: Omit<MCP, 'id' | 'createdAt' | 'updatedAt'>): Promise<MCP> {
    const newMCP: MCP = {
      id: uuidv4(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await this.repo.save(newMCP)
    return newMCP
  }

  // Update an existing MCP
  async updateMCP(data: Partial<MCP> & { id: string }): Promise<MCP> {
    const existing = await this.repo.getById(data.id)
    if (!existing) throw new Error(`MCP not found: ${data.id}`)

    const updated: MCP = {
      ...existing,
      ...data,
      updatedAt: new Date()
    }
    await this.repo.update(updated)
    return updated
  }

  // Delete an MCP
  async deleteMCP(id: string): Promise<void> {
    await this.repo.delete(id)
  }

  // Get an MCP by id
  async getMCPById(id: string): Promise<MCP> {
    const mcp = await this.repo.getById(id)
    if (!mcp) throw new Error(`MCP not found: ${id}`)
    return mcp
  }

  // Get all MCPs
  async getAllMCPs(): Promise<MCP[]> {
    return this.repo.getAll()
  }
}
