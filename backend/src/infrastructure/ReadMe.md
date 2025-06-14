# Database Layer 

## Aurora Infrastructure Layer

This folder contains Aurora/Postgres data source adapters and repository implementations for the Allen.ai backend.

## File Overview

| Path                                                                 | Purpose                                                             |
|---------------------------------------------------------------------|---------------------------------------------------------------------|
| `./AuroraSource.ts`                                                 | Low-level wrapper for Aurora Data API calls (execute, field mapping) |
| `./ChatMessageRepositoryAurora.ts`                                  | Repository for chat message persistence and queries                  |
| `./NotificationRepositoryAurora.ts`                                 | Repository for notification persistence and queries                  |

## Details

- **AuroraSource.ts**  
  Handles direct communication with the Aurora Serverless cluster using the AWS Data API.  
  Used by all repositories for executing SQL and extracting results.

- **ChatMessageRepositoryAurora.ts**  
  Implements the `ChatMessageRepository` interface, enabling saving and retrieving chat messages in Aurora.  
  Handles table initialization, upsert logic, mapping, and error handling.

- **NotificationRepositoryAurora.ts**  
  Implements the `NotificationRepository` interface, enabling saving, querying, updating (mark as read), and deleting user notifications in Aurora.  
  Handles table setup, upsert, mapping, and robust error handling.

## Testing

- All repositories are unit-tested using Jest and mocked AuroraDataSource.
- Error handling is validated by forcing the mock to reject.
- Mapping and contract alignment are covered by unit tests in `tests/unit/infrastructure/`.
