# Allen.ai Backend (ECS + Bedrock + Aurora)

This is the backend for the Allen.ai application. It's containerized and deployed to ECS.

## Core Architecture

Utilizes the concept of Domain Driven Design (DDD) to organize the code.

## Core Components

### Domain Layer:
* [User](./src/domain/user/ReadMe.md)
* [Chat](./src/domain/chat/ReadMe.md)
* [AI](./src/domain/ai/ReadMe.md)
* [Team](./src/domain/team/ReadMe.md)
* [Notification](./src/domain/notification/ReadMe.md)
* [MCP](./src/domain/mcp/ReadMe.md)
* [Settings](./src/domain/settings/ReadMe.md)

Each domain is a self-contained module that encapsulates the logic for a specific feature or business capability.

### Application Layer:

### Infrastructure Layer:

* [database/aurora](./src/infrastructure/database/aurora/ReadMe.md)

This folder contains database/* data source adapters and repository implementations for the Allen.ai backend.

### Interfaces Layer:

## Utils Layer

## app.ts

## index.ts