// src/infrastructure/database/aurora/ChatMessageRepositoryAurora.ts
import { AuroraDataSource } from './AuroraSource'
import { ChatMessage } from '../../../domain/chat/ChatMessage'
import { ChatMessageRepository } from '../../../domain/chat/ChatMessageRepository'

export class ChatMessageRepositoryAurora implements ChatMessageRepository {
    private tablesInitialized = false;
  
    constructor(private db: AuroraDataSource) {}
  
    async initializeTables(): Promise<void> {
      if (this.tablesInitialized) return;
  
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id TEXT PRIMARY KEY,
          conversation_id TEXT NOT NULL,
          sender_id TEXT NOT NULL,
          content TEXT NOT NULL,
          role TEXT CHECK (role IN ('user', 'assistant', 'system')) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_conversation_id (conversation_id),
          INDEX idx_sender_id (sender_id)
        )a
      `);
  
      this.tablesInitialized = true;
    }
  
        async save(message: ChatMessage): Promise<void> {
      await this.initializeTables();

      try {
        await this.db.execute(`
          INSERT INTO chat_messages (id, conversation_id, sender_id, content, role, created_at)
          VALUES (:id, :conversation_id, :sender_id, :content, :role, :created_at)
          ON CONFLICT(id) DO UPDATE SET
            content = EXCLUDED.content,
            role = EXCLUDED.role,
            updated_at = CURRENT_TIMESTAMP
        `, [
          { name: 'id', value: { stringValue: message.id } },
          { name: 'conversation_id', value: { stringValue: message.conversationId } },
          { name: 'sender_id', value: { stringValue: message.senderId } },
          { name: 'content', value: { stringValue: message.content } },
          { name: 'role', value: { stringValue: message.role || 'user' } },
          { name: 'created_at', value: { stringValue: message.createdAt.toISOString() } }
        ])
      } catch (err) {
        console.error('DB Error (save):', err)
        throw err
      }
    }
  
        async getMessagesForConversation(conversationId: string, limit = 50, offset = 0): Promise<ChatMessage[]> {
      await this.initializeTables()

      try {
        const result = await this.db.execute(
          `SELECT id, conversation_id, sender_id, content, role, created_at, updated_at
           FROM chat_messages 
           WHERE conversation_id = :conversation_id 
           ORDER BY created_at DESC 
           LIMIT :limit OFFSET :offset`,
          [
            { name: 'conversation_id', value: { stringValue: conversationId } },
            { name: 'limit', value: { longValue: limit } },
            { name: 'offset', value: { longValue: offset } }
          ]
        )

        return (result.records || []).map(this.toMessage)
      } catch (err) {
        console.error('DB Error (getMessagesForConversation):', err)
        throw err
      }
    }

    async getMessagesForUser(userId: string, limit = 50, offset = 0): Promise<ChatMessage[]> {
      await this.initializeTables()

      try {
        const result = await this.db.execute(
          `SELECT id, conversation_id, sender_id, content, role, created_at, updated_at
           FROM chat_messages
           WHERE sender_id = :sender_id
           ORDER BY created_at DESC
           LIMIT :limit OFFSET :offset`,
          [
            { name: 'sender_id', value: { stringValue: userId } },
            { name: 'limit', value: { longValue: limit } },
            { name: 'offset', value: { longValue: offset } }
          ]
        )

        return (result.records || []).map(this.toMessage)
      } catch (err) {
        console.error('DB Error (getMessagesForUser):', err)
        throw err
      }
    }
  
    private toMessage = (record: any): ChatMessage => {
      const message: ChatMessage = {
        id: AuroraDataSource.getFieldValue(record[0]),
        conversationId: AuroraDataSource.getFieldValue(record[1]),
        senderId: AuroraDataSource.getFieldValue(record[2]),
        content: AuroraDataSource.getFieldValue(record[3]),
        createdAt: new Date(AuroraDataSource.getFieldValue(record[5]))
      }

      // Add optional fields if present
      const role = AuroraDataSource.getFieldValue(record[4])
      if (role && role !== 'user') {
        message.role = role as 'user' | 'assistant' | 'system'
      }

      const updatedAt = AuroraDataSource.getFieldValue(record[6])
      if (updatedAt) {
        message.updatedAt = new Date(updatedAt)
      }

      return message
    }
  }
  