# Allen.ai Backend Domain Layer: Chat Module

## Example File Structure

```
src/domain/chat/
├── ChatMessage.ts
├── Conversation.ts
├── ChatParticipant.ts
├── types.ts
├── ChatRepository.ts
└── ChatPermissions.ts
```


---

# Description

This document explains the design of the **domain layer** for the chat system
The domain layer represents the “core logic” and business rules of the chat system, independent of frameworks, storage, or infrastructure.
All other objects (APIs, databases, AI integrations) depend on this domain layer. If you had to port the app to a new stack or framework, you’d re-use this code with minimal changes.

## Reasoning 

If you think about it, without chat it would just be a frontend application that doesn't do anything so every interaction with allen is a chat.

---

## Overview: What is the Domain Layer?

* **The domain layer defines**:

  * Core business objects (entities)
  * Data structures (value objects)
  * Business rules (domain services)
  * Abstract contracts for data access (repository interfaces)

* **The domain does NOT define**:

  * How data is stored (no SQL or ORM code)
  * How data is sent over the network (no HTTP/WebSocket code)
  * Any AWS, Postgres, or framework-specific code


---

## Core Chat Domain Components

### 1. Entities

Entities are the main objects in your business domain.
They have identity and can change over time.

* **ChatMessage**
  Represents a single message sent in a conversation.

  * Fields: id, conversationId, senderId, content, createdAt, embedding (for vector search)

* **Conversation**
  Represents a chat thread, channel, or conversation.

  * Fields: id, title, createdAt, participants

* **ChatParticipant**
  Represents a user’s membership in a conversation, including their role and when they joined.

  * Fields: userId, role, joinedAt

---

### 2. Value Objects

Value objects are small, immutable data types used to clarify intent and prevent bugs.
Examples include IDs and vector representations.

* **ChatMessageId, ConversationId, UserId, TeamId:**
  Types for unique IDs, to avoid mistakes like mixing up a message ID and a user ID.

* **EmbeddingVector:**
  Numeric array representing the vector embedding of a message (for retrieval-augmented generation).

---

### 3. Repository Interfaces

A repository defines what operations are possible for storing and retrieving chat data.
These are pure TypeScript interfaces, not implementations.

* **ChatRepository**

  * saveMessage(msg): Save a new message
  * getMessages(conversationId): Get all messages for a conversation
  * getConversation(conversationId): Get a conversation by ID
  * findConversationsByUser(userId): Get all conversations a user participates in
  * queryMessagesByVector(vector, limit): Get messages similar to a given vector

You will implement these repositories later, in the infrastructure layer (e.g., using Postgres).

---

### 4. Domain Services

Domain services encapsulate business rules or logic that span across entities.

* **Permission Checks**
  Example:

  * `canUserSendMessage(conversation, userId)`: Returns true if the user is a participant.

More advanced rules (like team-based access or message deletion permissions) can be added here.

