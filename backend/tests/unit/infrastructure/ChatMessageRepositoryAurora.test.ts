// tests/unit/infrastructure/ChatMessageRepositoryAurora.test.ts
import { ChatMessageRepositoryAurora } from '../../../src/infrastructure/database/aurora/ChatMessageRepositoryAurora'
import { AuroraDataSource } from '../../../src/infrastructure/database/aurora/AuroraSource'
import { expect, jest, beforeEach, describe, it } from '@jest/globals'
import { ChatMessage } from '../../../src/domain/chat/ChatMessage'
import { DatabaseError } from '../../../src/utils/errors'

describe('ChatMessageRepositoryAurora', () => {
    let mockDb: jest.Mocked<AuroraDataSource>
 
    // Helper: always fresh repo instance
    const buildRepo = () => new ChatMessageRepositoryAurora(mockDb)
 
    beforeEach(() => {
      // Setup: Create a fresh mock database for each test to ensure isolation
      mockDb = { execute: jest.fn() } as any
      jest.clearAllMocks()
    })
 
    // Test: Verifies that the repository can successfully initialize database tables
    // Assumption: initializeTables() runs DDL commands to create the chat_messages table
    it('should initialize tables (mocked)', async () => {
      // Arrange: Mock successful database response
      mockDb.execute.mockResolvedValueOnce({ $metadata: {} } as any)
      
      // Act: Initialize tables through the repository
      const repo = buildRepo()
      await expect(repo.initializeTables()).resolves.not.toThrow()
      
      // Assert: Verify the database execute method was called once (for table creation)
      expect(mockDb.execute).toHaveBeenCalledTimes(1)
    })
 
    // Test: Verifies that a chat message can be persisted to the database
    // Assumption: save() method calls initializeTables() first, then inserts the message
    it('should save a chat message without error', async () => {
      // Arrange: Mock successful responses for both init and save operations
      mockDb.execute
        .mockResolvedValueOnce({ $metadata: {} } as any) // init tables
        .mockResolvedValueOnce({ $metadata: {} } as any) // save message
      
      const repo = buildRepo()
      
      // Create a valid chat message domain object
      const msg: ChatMessage = {
        id: '1',
        conversationId: 'c1',
        senderId: 'u1',
        content: 'Hello!',
        createdAt: new Date(),
        role: 'user'
      }
      
      // Act: Save the message
      await expect(repo.save(msg)).resolves.not.toThrow()
      
      // Assert: Verify both init and save operations were called
      expect(mockDb.execute).toHaveBeenCalledTimes(2)
    })
 
    // Test: Verifies retrieval of messages for a specific conversation
    // Assumption: getMessagesForConversation() calls init first, then queries by conversationId
    it('should get messages for conversation (with records)', async () => {
      const now = new Date()
      
      // Arrange: Mock init response and query response with sample data
      mockDb.execute
        .mockResolvedValueOnce({ $metadata: {} } as any) // init tables
        .mockResolvedValueOnce({
          $metadata: {},
          records: [
            // Mock Aurora RDS Data API response format (array of field values)
            [
              { stringValue: '1' },      // id
              { stringValue: 'c1' },     // conversationId  
              { stringValue: 'u1' },     // senderId
              { stringValue: 'hi!' },    // content
              { stringValue: 'user' },   // role
              { stringValue: now.toISOString() }, // createdAt
              { stringValue: now.toISOString() }  // updatedAt (assumption)
            ]
          ]
        } as any)
      
      const repo = buildRepo()
      
      // Act: Retrieve messages for conversation 'c1'
      const res = await repo.getMessagesForConversation('c1')
      
      // Assert: Verify the response structure and data mapping
      expect(res).toHaveLength(1)
      
      // Verify core required fields are properly mapped from Aurora response
      expect(res[0]).toMatchObject({
        id: '1',
        conversationId: 'c1',
        senderId: 'u1',
        content: 'hi!',
      })
      
      // Verify role field handling (assuming it defaults to 'user' if not set)
      expect(res[0].role ?? 'user').toBe('user')
    })
 
    // Test: Verifies proper error handling when database operations fail
    // Assumption: Repository wraps database errors in custom DatabaseError type
    it('should throw DatabaseError on db error', async () => {
      // Arrange: Mock database failure
      mockDb.execute.mockRejectedValueOnce(new Error('db fail'))
      
      const repo = buildRepo()
      
      // Act & Assert: Verify that database errors are properly wrapped
      await expect(repo.initializeTables()).rejects.toThrow(DatabaseError)
    })
  })