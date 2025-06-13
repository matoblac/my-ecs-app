## Team Domain

## Overview

This architecture is meant support both solo users and teams, depending on user joins a team or not.

## Features

- Create a team
- Join a team
- Leave a team
- Define team context policy(how context is shared with team members)

*Note: this system isn't meant to both start a private user and then join a team later vise versa because, they aurora tables are not designed to support this(perhaps? Need to confirm TODO)

## Components 

```bash
/backend/src/domain/team/
├── Team.ts
├── TeamRepository.ts
├── TeamService.ts
├── TeamContextPolicy.ts
```

## Features

* Users share vector embeddings with team members through the TeamContextPolicy.ts
    * users also share ai responses with team members through the TeamContextPolicy.ts
    * MCP metadata with team members through the TeamContextPolicy.ts
    * Team chat history with team members through the TeamContextPolicy.ts
    * Aurora queries and AI prompts are scoped to the team ID
    * Responses are smarter and more collective
    * Great for org-wide assistants (like Slackbot or company-wide Claude)


## Why join a team?

“A team is just a shared memory space. Join it, and you opt into collective learning.” 


## References 

Reference Team from UserService to assign/join teams 
Inject teamId into AI contect construction

```typescript
// AIService.ts
// Inject teamId into AI contect construction
const scopeId = user.teamId || user.id;

const context = await this.vectorService.getVectorContext(scopeId);

```