import { AiService } from "../ai/AiService";
import { ChatMessageRepository } from "./ChatMessageRepository";
import { ChatMessage } from "./ChatMessage";
import { v4 as uuidv4 } from 'uuid';

export class ChatService {
  constructor(
    private messageRepo: ChatMessageRepository,
    private aiService: AiService
  ) {}

  async chat(userPrompt: string, conversationId: string) {
    // 1. Load recent messages for context (semantic context window)
    const history = await this.messageRepo.getMessagesForConversation(conversationId, 10, 0);

    // 2. Get AI response
    const aiResponse = await this.aiService.getResponse(userPrompt, history);

    // 3. Save assistant message (optional, based on system design)
    await this.saveAssistantMessage(conversationId, aiResponse.content);

    return aiResponse;
  }

  async saveUserMessage(conversationId: string, senderId: string, content: string): Promise<void> {
    const message: ChatMessage = {
      id: uuidv4(),
      conversationId,
      senderId,
      content,
      role: 'user',
      createdAt: new Date(),
    };
    await this.messageRepo.save(message);
  }

  async saveAssistantMessage(conversationId: string, content: string): Promise<void> {
    const message: ChatMessage = {
      id: uuidv4(),
      conversationId,
      senderId: 'assistant', // could be a system constant
      content,
      role: 'assistant',
      createdAt: new Date(),
    };
    await this.messageRepo.save(message);
  }

  async getHistory(conversationId: string): Promise<ChatMessage[]> {
    return this.messageRepo.getMessagesForConversation(conversationId);
  }
}
