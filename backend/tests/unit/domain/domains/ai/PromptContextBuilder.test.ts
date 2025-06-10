import { PromptContextBuilder } from "../../../../../src/domain/ai/PromptContextBuilder"

// @ts-nocheck

// Test the PromptContextBuilder class and its implementation

describe("PromptContextBuilder", () => {
  it("combines similar and recent chats into context", () => {
    const similar = [{
      id: "msg-1",
      conversationId: "conv-1",
      senderId: "user-1",
      content: "How to deploy ECS?",
      createdAt: new Date()
    }];
    const recent = [{
      id: "msg-2", 
      conversationId: "conv-2",
      senderId: "user-2",
      content: "What is Aurora vector search?",
      createdAt: new Date()
    }];
    const context = PromptContextBuilder.buildContext(similar, recent);
    expect(context).toMatch(/Relevant past chats/);
    expect(context).toMatch(/How to deploy ECS/);
    expect(context).toMatch(/What is Aurora vector search/);
  });
});
