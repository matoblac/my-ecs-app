# Allen.ai

[![E2E Tests](https://github.com/matoblac/my-ecs-app/actions/workflows/playwright.yml/badge.svg)](https://github.com/matoblac/my-ecs-app/actions/workflows/playwright.yml)

![chat](https://github.com/matoblac/my-ecs-app/blob/main/frontend/public/chat-home-page.png) 

## What is Allen.ai?

Advanced AI chat application with a WebSocket-driven backend, vector-enabled knowledge base, and real-time Bedrock inference through AWS-managed infrastructure.

## How does it work?

Combining a WebSocket-driven backend, a vector-enabled knowledge base, and real-time Bedrock inference through AWS-managed infrastructure. The system supports intelligent, context-aware conversations that evolve with memory and structure.

### TL;DR(What It Does)

* PS I considered a diagram but, mermaid live editor is faster and easier to scale images.

Copy and paste the following into [Mermaid Live Editor](https://mermaid.live/) to see the system in action:

```code
graph TD
  A[User Message] --> B[WebSocket Gateway]
  B --> C[Save Message in Aurora]
  C --> D[Query Vector Similarity from Aurora]
  C --> E[Fetch Recent Chat History]
  D --> F[Build Smart Context]
  E --> F
  F --> G[Call Amazon Bedrock with Enriched Prompt]
  G --> H[Save AI Response to Aurora]
  H --> I[Stream Response via WebSocket]
```
## System Requirements

TLDR: based on the following requirements **This system will learn more the more it's used automatically**

- WebSocket-driven backend
- Message Persistence using [Aurora PostgreSQL (with pgvector)](https://aws.amazon.com/blogs/machine-learning/dive-deep-into-vector-data-stores-using-amazon-bedrock-knowledge-bases/)
- Vector Search for context-aware responses
- Real-time Bedrock inference
- Context-aware conversations that evolve with memory and structure
- User authentication and authorization
- Team collaboration features
- Knowledge base integration

### Privacy Concerns When Deploying at Team or Organization Level

As mentioned above, This system automatically learns from user conversations by persisting chat history and embeddings into Aurora. If deployed at a team or organization level, messages shared in chat may be visible or influence responses for other users. For past usage to influence future responses is a feature not a bug, we want to be able to share expert verified knowledge which may be kept and utilized for many years with evolving context.

> Warning: If a user shares sensitive or inappropriate content, it may be retained and surfaced in future team queries. While we may support message deletion in the future, it is non-trivial to enforce forgetting once data has been embedded or used in downstream prompts.

* The above warning can be mitigated or accepted but, IF NOT mitigated in time the damage is related to reputation and trust. Please see [prompt_injection_poisoning.md](./docs/prompt_injection_poisoning.md) for more details. 

#### Mitigation Strategy: Privacy-Preserving RAG

```bash
-- Instead of storing:
"John from Engineering asked about AWS deployment and solved it with..."
-- Store:
"user_7a3f9d2b asked about AWS deployment and solved it with..."
```

##### AI Context Building:

```bash
const context = `
Previous relevant discussions:
- user_7a3f9d2b worked on AWS deployment using ECS
- user_2m8k5n9x solved database scaling with Aurora
- user_9p2l4r7t optimized React performance with lazy loading
`;
```
##### Benefits:

- **Anonymization**: Reduces the risk of sensitive data exposure
- **Contextual Understanding**: Enhances response accuracy by leveraging relevant historical context
- **Data Retention**: Reduces the need to store potentially sensitive information

## Development

*This document is intended for business and engineering leadership. For detailed system structure, database schemas, and deployment scripts, refer to* [development.md](./docs/development.md)
