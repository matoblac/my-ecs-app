// src/tests/unit/domain/mcp/MCPService.test.ts
// MCP Service Tests


import { MCPService } from '../../../../src/domain/mcp/MCPService'
import { MCPRepository } from '../../../../src/domain/mcp/MCPRepository'
import { MCP } from '../../../../src/domain/mcp/MCP'
import { expect, jest, beforeEach, describe, it } from '@jest/globals'

// Test suite for MCP Service
describe('MCPService', () => {
  // Mock MCP Repository
  let repo: jest.Mocked<MCPRepository>
  // MCP Service
  let service: MCPService

  // Setup before each test
  beforeEach(() => {
    repo = {
      save: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }
    service = new MCPService(repo)
  })

  // Test for creating a new MCP
  it('creates a new MCP', async () => {
    const data = { name: 'Test MCP', description: 'Test description' }
    const result = await service.createMCP(data)

    expect(result).toMatchObject(data)
    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining(data))
  })

  // Test for updating an existing MCP
  it('updates an existing MCP', async () => {
    const existingMCP: MCP = {
      id: 'abc',
      name: 'Old Name',
      description: 'Old desc',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    repo.getById.mockResolvedValue(existingMCP)

    const result = await service.updateMCP({ id: 'abc', name: 'New Name' })

    expect(result.name).toBe('New Name')
    expect(repo.update).toHaveBeenCalled()
  })

  // Test for throwing if MCP not found on update
  it('throws if MCP not found on update', async () => {
    repo.getById.mockResolvedValue(null)
    await expect(service.updateMCP({ id: 'missing', name: 'X' }))
      .rejects.toThrow('MCP not found: missing')
  })

  // Test for getting MCP by ID
  it('gets MCP by ID', async () => {
    const mcp: MCP = {
      id: '123',
      name: 'X',
      description: 'Y',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    repo.getById.mockResolvedValue(mcp)

    const result = await service.getMCPById('123')
    expect(result).toEqual(mcp)
  })

  // Test for throwing if MCP not found on getById
  it('throws if MCP not found on getById', async () => {
    repo.getById.mockResolvedValue(null)
    await expect(service.getMCPById('not-there')).rejects.toThrow('MCP not found: not-there')
  })

  // Test for getting all MCPs
  it('gets all MCPs', async () => {
    const mcps: MCP[] = []
    repo.getAll.mockResolvedValue(mcps)
    const result = await service.getAllMCPs()
    expect(result).toEqual(mcps)
  })

  // Test for deleting MCP by ID
  it('deletes MCP by ID', async () => {
    await service.deleteMCP('abc')
    expect(repo.delete).toHaveBeenCalledWith('abc')
  })
})
