import { AiResponse } from "./AiResponse";
import { BedrockClient } from "../../infrastructure/bedrock/BedrockClient";
import { ChatMessage } from "../chat/ChatMessage";


export class AiService {
  constructor(private bedrockClient: BedrockClient) {}

  // Given semantic context (chat history, retrieved docs), ask Bedrock
  async getResponse(prompt: string, contextMessages: ChatMessage[]): Promise<AiResponse> {
    const contextStrings = contextMessages.map(msg => msg.content);
    return await this.bedrockClient.chat(prompt, contextStrings);
  }
}
