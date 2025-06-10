# MY ECS APP Backend Domain Layer: AI Module

## TL;DR

* **The domain layer defines the rules, data structures, and contracts for your app.**
* **It is pure TypeScript, independent of any backend tech.**
* **Entities = main objects, Value Objects = small immutable types, Repositories = interfaces for data access, Domain Services = core business rules.**
* **Build this first for long-term flexibility and clean, testable code.**

---

## Structure for `/src/domain/ai`

```bash
/backend/src/domain/ai/
├── LLMClient.ts              # Interface: .chat(), .embed(), etc.
├── PromptContextBuilder.ts   # Logic for RAG context construction
├── PromptTemplate.ts         # Templates for Bedrock prompts
├── BedrockInference.ts       # Optional: concrete rules for Bedrock-like models
├── EmbeddingService.ts       # Interface for vector creation
├── MessageEnricher.ts        # Utility to enrich messages before AI
└── AiResponse.ts             # AI-generated response type (summary, source refs, etc.)
```

## End-to-End Example: How a User Message Triggers Allen 

1. User sends a chat message from the frontend (React) → hits backend WebSocket server.

2. Backend does:

    - Saves the message (and embedding) to Aurora (vector database)
    - Runs a vector search for similar messages in Aurora
    - Fetches recent chat history

3. Backend calls the AI (Bedrock) service:

    - Combines the most relevant past chats and the current message into a prompt using the domain/ai logic (PromptContextBuilder)
    - Sends this prompt to the Bedrock LLM (LLMClient)
    - Receives the AI-generated response

4. Backend saves the AI response to Aurora and streams it back to the user via WebSocket.

Simplified example but, in Typescript it would look like this:

```typescript
// 1. User message received
webSocket.on("userMessage", async (chatId, userId, message) => {
  // 2. Persist the message
  await chatRepository.saveMessage({ chatId, userId, content: message });
  
  // 3. Vector search for similar past chats
  const similar = await chatRepository.queryMessagesByVector(message, 5);

  // 4. Get recent chat history
  const recent = await chatRepository.getRecentMessages(chatId, 10);

  // 5. Build context for the AI
  const context = PromptContextBuilder.buildContext(similar, recent);

  // 6. Generate AI response
  const aiResponse = await llmClient.chat(context + "\n\nUser: " + message);

  // 7. Save AI response and send to user
  await chatRepository.saveMessage({ chatId, userId: "ai", content: aiResponse });
  webSocket.send("aiMessage", aiResponse);
});
```

## Where AI lives in the Flow 

* Domain/ai layer: `This is where the AI logic lives called on by the User->LLMClient.chat(aiResponse)`

    - PromptContextBuilder: Builds the context for the AI
    - LLMClient: handles all interaction with Bedrock (real or simulated)
    - EmbeddingService: handles all interaction with the embedding service (real or simulated)
    - MessageEnricher: enriches the message before it is sent to the LLM
    - AiResponse: the response from the LLM

* Domain/chat layer: `Requests starts here and ends here. This is where the user's message is saved and the AI response is streamed back to the user.`

    - ChatRepository: handles all interaction with the chat repository (real or simulated)
    - ChatMessage: the message from the user
    - ChatParticipant: the participant in the chat(user,role,etc.)