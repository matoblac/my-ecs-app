// Simulate a Bedrock-style prompt template

// This is a stub for the PromptTemplate interface. 
// This PromptTemplate would be launched from the backend and would be used to generate prompts for the LLM.
// It is initaited by LLMClient.chat()

export const basePromptTemplate = (context: string, message: string) =>
    `Context:\n${context}\n\nUser message:\n${message}\n\nRespond concisely and helpfully.`;
  