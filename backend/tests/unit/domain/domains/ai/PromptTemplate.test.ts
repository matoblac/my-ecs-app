import { basePromptTemplate } from "../../../../../src/domain/ai/PromptTemplate"

describe("PromptTemplate", () => {
  it("formats prompt with context and message", () => {
    const context = "Some prior context";
    const message = "What is Bedrock?";
    const prompt = basePromptTemplate(context, message);
    expect(prompt).toContain(context);
    expect(prompt).toContain(message);
  });
});
