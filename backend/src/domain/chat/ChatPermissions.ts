// src/domain/chat/ChatPermissions.ts
import { Conversation } from "./Conversation";

export function canUserSendMessage(conversation: Conversation, userId: string): boolean {
  // Must be a participant
  return conversation.participants.some(p => p.userId === userId)
}
