import { ChatMessage } from './ChatMessage'
import { UserId } from './ChatParticipant'
import { ConversationId } from './types'

export interface ChatMessageRepository {
  save(message: ChatMessage): Promise<void>
  getMessagesForConversation(conversationId: ConversationId, limit?: number, offset?: number): Promise<ChatMessage[]>
  getMessagesForUser(userId: UserId, limit?: number, offset?: number): Promise<ChatMessage[]>
} 