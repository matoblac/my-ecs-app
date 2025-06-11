# MY ECS APP Backend Domain Layer: User Module

## TL;DR

* **The domain layer defines the rules, data structures, and contracts for your app.**

## Structure for `/src/domain/user`

```bash
/backend/src/domain/user/
├── User.ts
├── UserRepository.ts
├── UserService.ts
├── UserController.ts
├── UserRouter.ts
├── UserRoutes.ts
```
Cognito handles auth but, this domain still owns how the app uses that identity.

## How This Domain Works With Other Domains

- Chat: Filters what conversations a user can see based on their team membership.
- AI: Decides whether to use AI based on user settings.
- Privacy: Pseudonymizes user IDs for privacy.