import { logInfo } from "../../utils/logger";

// This is a stub for the EmbeddingService interface. 
// This EmbeddingService would be launched from the backend and would be used to embed the user's messages into a vector database.

export interface EmbeddingService {
  getEmbedding(text: string): Promise<number[]>;
}

export class StubEmbeddingService implements EmbeddingService {
  async getEmbedding(text: string): Promise<number[]> {
    logInfo("EmbeddingService.getEmbedding called", { text });
    return Promise.resolve(Array(768).fill(Math.random()));
  }
}
