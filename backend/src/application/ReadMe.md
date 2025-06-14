# Application Layer (Use Case / Orchestration)

This directory contains your **application services**—the “glue” between the HTTP layer (API, serverless, etc), the domain logic, and infrastructure (database, AI, notifications, etc).

**Purpose:**
Coordinate business workflows and orchestrate calls across your domain and infrastructure without knowledge of HTTP/Express specifics.

---

## File Overview

| File/Directory                      | Responsibility / Description                                                     |
| ----------------------------------- | -------------------------------------------------------------------------------- |
| `ChatApplicationService.ts`         | Orchestrates user <-> chat <-> AI flow; handles context fetching and reply logic |
| `TeamApplicationService.ts`         | (Planned) Manages team-level onboarding, team chat, and provisioning             |
| `NotificationApplicationService.ts` | (Planned) Handles notification workflows: create, deliver, mark as read, etc.    |
| `UserApplicationService.ts`         | (Planned) User signup, profile, and onboarding flows                             |
| `index.ts`                          | (Optional, if needed) Entry point for running app-level workflows                |

---

## Example Structure

```text
backend/
  src/
    application/
      ChatApplicationService.ts
      TeamApplicationService.ts
      NotificationApplicationService.ts
      UserApplicationService.ts
      ReadMe.md
```

---

## Principles

* **No HTTP logic:** Keep HTTP parsing, Express routes, and REST out of this layer.
* **Testable:** All application logic should be unit-testable in isolation.
* **Orchestration only:** No direct database queries or network calls—delegate to domain or infra.
* **Dependency injection:** All dependencies (services, repositories, adapters) are passed in via constructor.

---

## Example Service

```ts
// ChatApplicationService.ts

export class ChatApplicationService {
  constructor(
    private chatService: ChatService,
    private aiService: AiService
  ) {}

  async handleUserMessage(userId: string, conversationId: string, content: string) {
    await this.chatService.saveUserMessage(userId, conversationId, content);
    const context = await this.chatService.getHistory(conversationId);
    const aiResponse = await this.aiService.getResponse(content, context);
    await this.chatService.saveAssistantMessage(conversationId, aiResponse.content);
    return aiResponse;
  }
}
```

---

## How This Fits In

1. **HTTP/API Layer** receives a request.
2. Calls an **Application Service** (e.g. `ChatApplicationService`).
3. Application Service orchestrates domain and infra to complete the workflow.
4. Returns a result/response to the API layer.

