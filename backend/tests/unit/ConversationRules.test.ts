// src/tests/unit/ConversationRules.test.ts

import { canUserSendMessage, canUserAddParticipant } from '../../src/domain/chat/ConversationRule'
import { Conversation } from '../../src/domain/chat/Conversation'
import { ChatParticipant } from '../../src/domain/chat/ChatParticipant'
import { UserId, ConversationId } from '../../src/domain/chat/types'

describe('ConversationRules', () => {
  const user1: UserId = 'user-1'
  const user2: UserId = 'user-2'
  const adminUser: UserId = 'admin-1'

  const baseParticipants: ChatParticipant[] = [
    { userId: user1, role: 'member', joinedAt: new Date() },
    { userId: user2, role: 'member', joinedAt: new Date() },
    { userId: adminUser, role: 'admin', joinedAt: new Date() }
  ]

  const conversation: Conversation = {
    id: 'conv-1' as ConversationId,
    title: 'Test Conversation',
    createdAt: new Date(),
    participants: baseParticipants
  }

  test('canUserSendMessage returns true for participant', () => {
    expect(canUserSendMessage(conversation, user1)).toBe(true)
    expect(canUserSendMessage(conversation, user2)).toBe(true)
    expect(canUserSendMessage(conversation, adminUser)).toBe(true)
  })

  test('canUserSendMessage returns false for non-participant', () => {
    expect(canUserSendMessage(conversation, 'not-a-user' as UserId)).toBe(false)
  })

  test('canUserAddParticipant returns true for admin', () => {
    expect(canUserAddParticipant(conversation, adminUser)).toBe(true)
  })

  test('canUserAddParticipant returns false for non-admin', () => {
    expect(canUserAddParticipant(conversation, user1)).toBe(false)
    expect(canUserAddParticipant(conversation, user2)).toBe(false)
  })
})
