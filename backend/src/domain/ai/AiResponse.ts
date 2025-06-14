//backend/src/domain/ai/AiResponse.ts
// Define AI response structure
export interface AiResponse {
    content: string;
    sources?: string[];
    relevanceScore?: number;
  }
  