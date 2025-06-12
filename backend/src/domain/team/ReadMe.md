# Why do you care about teams?

TODO make the style of this readme more consistent with the other readmes

This architecture is meant support both solo users and teams, depending on user joins a team or not.

*Note: this system isn't meant to both start a private user and then join a team later vise versa because, they aurora tables are not designed to support this(perhaps? Need to confirm TODO)

## Structure for `/src/domain/team`

```bash
/backend/src/domain/team/
├── Team.ts
├── TeamRepository.ts
├── TeamService.ts
├── TeamContextPolicy.ts
```

## User IS in a team features

* Users share vector embeddings with team members through the TeamContextPolicy.ts
    * users also share ai responses with team members through the TeamContextPolicy.ts
    * MCP metadata with team members through the TeamContextPolicy.ts
    * Team chat history with team members through the TeamContextPolicy.ts
    * Aurora queries and AI prompts are scoped to the team ID
    * Responses are smarter and more collective
    * Great for org-wide assistants (like Slackbot or company-wide Claude)

## User IS NOT in a team features

* Solo / Anonymous Mode, consider this can be a feature flag OR a separate user type
* Each user gets isolated context
* Vector searches only return their own history
* Safer for sensitive or unverified experimentation
* Allows opt-in privacy

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