// backend/src/application/ChatApplicationService.ts
import { ChatService } from "../domain/chat/ChatService";
import { AiService } from "../domain/ai/AiService";
import { ChatMessageRepository } from "../domain/chat/ChatMessageRepository";

export class ChatApplicationService {
  constructor(
    private chatService: ChatService,
    private aiService: AiService
  ) {}

  async handleUserMessage(userId: string, conversationId: string, content: string) {
    // 1. Add user's message to the repo
    await this.chatService.saveUserMessage(userId, conversationId, content);

    // 2. Fetch context and get AI response
    const history = await this.chatService.getHistory(conversationId);
    const aiResponse = await this.aiService.getResponse(content, history);

    // 3. Save AI's reply
    await this.chatService.saveAssistantMessage(conversationId, aiResponse.content);

    return aiResponse;
  }
}
