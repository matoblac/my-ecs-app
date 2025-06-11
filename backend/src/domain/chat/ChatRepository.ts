// src/domain/chat/ChatRepository.ts
import { ChatMessage } from "./ChatMessage";
import { Conversation } from "./Conversation";
import { EmbeddingVector } from "./ChatMessage";
import { ConversationId } from "./types";
import { UserId } from "./ChatParticipant";

export interface ChatRepository {
  saveMessage(msg: ChatMessage): Promise<void>
  getMessages(conversationId: ConversationId): Promise<ChatMessage[]>
  getConversation(conversationId: ConversationId): Promise<Conversation | null>
  findConversationsByUser(userId: UserId): Promise<Conversation[]>
  queryMessagesByVector(vector: EmbeddingVector, limit: number): Promise<ChatMessage[]>
}
