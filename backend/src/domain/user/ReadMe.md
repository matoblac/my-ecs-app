# MY ECS APP Backend Domain Layer: User Module

## TL;DR

* **The domain layer defines the rules, data structures, and contracts for your app.**

## Structure for `/src/domain/user`

```bash
/backend/src/domain/user/
├── User.ts
├── UserRepository.ts
├── UserService.ts
|-- UserSettings.ts
|-- ShareContext.ts
|-- UserAudit.ts
|-- UserNotification.ts
```
Cognito handles auth but, this domain still owns how the app uses that identity.

## How Does This Domain Work With Other Domains

- Chat: Filters what conversations a user can see based on their team membership.
- AI: Decides whether to use AI based on user settings.
- Team: Handles user team membership and permissions.
- Settings: Handles user settings and preferences.
- Notifications: Handles user notifications.
- Audit: Handles audit mechnismes with superuser access.