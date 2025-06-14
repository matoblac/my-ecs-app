//backend/src/domain/ai/LLMClient.ts
import { logInfo, logError } from "../../utils/logger";

// This is a stub for the LLMClient interface. 
// This LLM would be launched from the backend and would be used to generate responses to the user's messages.  


// Simulated interface
export interface LLMClient {
  chat(prompt: string): Promise<string>;
  embed(text: string): Promise<number[]>;
}

// Mock implementation (stub)
export class StubLLMClient implements LLMClient {
  async chat(prompt: string): Promise<string> {
    logInfo("LLMClient.chat called", { prompt });
    // Simulate a Bedrock response
    return Promise.resolve(`[AI reply to]: ${prompt}`);
  }
  async embed(text: string): Promise<number[]> {
    logInfo("LLMClient.embed called", { text });
    // Return a fake embedding
    return Promise.resolve(Array(768).fill(0.01));
  }
}
