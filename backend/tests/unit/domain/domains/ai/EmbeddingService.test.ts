import { StubEmbeddingService } from "../../../../../src/domain/ai/EmbeddingService"

// Test the EmbeddingService class and its implementation

describe("EmbeddingService", () => {
  const embService = new StubEmbeddingService();

  it("returns a mock embedding vector", async () => {
    const result = await embService.getEmbedding("Test");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(10); // adjust later!! 
  });
});
