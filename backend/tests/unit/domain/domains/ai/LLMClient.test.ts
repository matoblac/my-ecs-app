import { StubLLMClient } from "../../../../../src/domain/ai/LLMClient"
// @ts-nocheck

// Test the LLMClient interface and its implementation


describe("LLMClient", () => {
  const llm = new StubLLMClient();

  it("returns a simulated chat response", async () => {
    const prompt = "What is RAG?";
    const response = await llm.chat(prompt);
    expect(response).toContain(prompt);
  });

  it("returns a fake embedding of expected length", async () => {
    const emb = await llm.embed("Some text");
    expect(Array.isArray(emb)).toBe(true);
    expect(emb.length).toBe(768);
    expect(emb.every(x => typeof x === "number")).toBe(true);
  });
});
