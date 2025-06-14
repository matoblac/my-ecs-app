import { ChatMessageRepositoryAurora } from '../../../src/infrastructure/database/aurora/ChatMessageRepositoryAurora'
import { AuroraDataSource } from '../../../src/infrastructure/database/aurora/AuroraSource'
import { ChatMessage } from '../../../src/domain/chat/ChatMessage'
import { v4 as uuidv4 } from 'uuid'

describe('ChatMessageRepositoryAurora', () => {
  const db = new AuroraDataSource()
  const repo = new ChatMessageRepositoryAurora(db)

  const testConversationId = `conv-${uuidv4()}`
  const testSenderId = `user-${uuidv4()}`

  const fakeMessage: ChatMessage = {
    id: uuidv4(),
    conversationId: testConversationId,
    senderId: testSenderId,
    content: 'Hello from integration test!',
    createdAt: new Date()
  }

  beforeAll(async () => {
    await repo.initializeTables()
  })

  afterEach(async () => {
    await db.execute(`DELETE FROM chat_messages WHERE conversation_id = ?`, [
      { name: 'conversation_id', value: { stringValue: testConversationId } }
    ])
  })

  it('should save and retrieve a chat message', async () => {
    await repo.save(fakeMessage)

    const messages = await repo.getMessagesForConversation(testConversationId)

    expect(messages).toHaveLength(1)
    expect(messages[0]).toMatchObject({
      id: fakeMessage.id,
      conversationId: testConversationId,
      senderId: testSenderId,
      content: 'Hello from integration test!'
    })
  })

  it('should return empty array for unknown conversation', async () => {
    const result = await repo.getMessagesForConversation('unknown-conv-id')
    expect(result).toEqual([])
  })
})
