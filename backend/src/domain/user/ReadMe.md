# MY ECS APP Backend Domain Layer: User Module

## TL;DR

* **The domain layer defines the rules, data structures, and contracts for your app.**

## Structure for `/src/domain/user`

```bash
/backend/src/domain/user/
    - Auth (tokens, Cognito references)
    - Identity hashes
    - User preferences (e.g. aiEnabled, notificationSettings)
    - Privacy logic (like the pseudonymization hash you built)
    - “Get my data” logic (data export, deletion requests)
```
Cognito handles auth but, this domain still owns how the app uses that identity.

# TODO:
complete the user domain layer.