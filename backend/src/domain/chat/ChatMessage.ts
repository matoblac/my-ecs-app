// src/domain/chat/ChatMessage.ts
import { ConversationId } from "./types";
import { UserId } from "./ChatParticipant";

// this is the chat message domain object

export type ChatMessageId = string;

export type EmbeddingVector = number[];

export interface ChatMessage {
    id: ChatMessageId
    conversationId: ConversationId
    senderId: UserId
    content: string
    role?: 'user' | 'assistant' | 'system'
    createdAt: Date
    updatedAt?: Date
    embedding?: EmbeddingVector
}
  