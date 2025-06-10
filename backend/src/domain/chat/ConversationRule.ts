import { Conversation } from './Conversation'
import { UserId } from './types'
import { ChatParticipant } from './ChatParticipant'

// Returns true if the user is a participant in the conversation
// This is a domain rule, so it is immutable
// It is used to check if a user can send a message to a conversation

export function canUserSendMessage(conversation: Conversation, userId: UserId): boolean {
  return conversation.participants.some((p: ChatParticipant) => p.userId === userId)
}

// Returns true if the user is an admin or owner (can add participants)
export function canUserAddParticipant(conversation: Conversation, userId: UserId): boolean {
  return conversation.participants.some(
    (p: ChatParticipant) => p.userId === userId && (p.role === 'owner' || p.role === 'admin')
  )
}

// Returns true if the user is an admin or owner (can delete the conversation)
// This is a domain rule, so it is immutable
// It is used to check if a user can delete a conversation


export function canUserDeleteConversation(conversation: Conversation, userId: UserId): boolean {
    return conversation.participants.some(
      (p: ChatParticipant) => p.userId === userId && (p.role === 'owner' || p.role === 'admin')
    )
  }
  
