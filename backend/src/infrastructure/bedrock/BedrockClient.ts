import { AiResponse } from "../../domain/ai/AiResponse";

// Abstract interface (for DI/testability)
export interface BedrockClient {
  chat(prompt: string, context?: string[]): Promise<AiResponse>;
  embed(text: string): Promise<number[]>;
}

// Real implementation (simplified, needs actual AWS SDK logic)
export class AwsBedrockClient implements BedrockClient {
  async chat(prompt: string, context: string[] = []): Promise<AiResponse> {
    // TODO: Call AWS Bedrock model API, pass context for RAG.
    // Replace this stub with actual AWS SDK code.
    const fakeContent = `[Bedrock reply to]: ${prompt} with context: ${context.join(", ")}`;
    return { content: fakeContent, sources: context, relevanceScore: 0.9 };
  }
  async embed(text: string): Promise<number[]> {
    // TODO: Call Bedrock embedding model
    return Array(768).fill(Math.random());
  }
}
