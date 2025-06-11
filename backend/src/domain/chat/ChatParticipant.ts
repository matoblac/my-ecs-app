// src/domain/chat/ChatParticipant.ts
export type UserId = string;

// Purpose: Defines a user's participation(and role) in a conversation
// This is a value object, so it is immutable

export interface ChatParticipant {
    userId: UserId
    role: 'member' | 'admin' | 'owner'
    joinedAt: Date
  }
  