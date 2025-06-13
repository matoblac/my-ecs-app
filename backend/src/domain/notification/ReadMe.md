# Notification Domain

## Overview

The Notification Domain is responsible for managing notifications for the application.

## Features

- Send notifications to users
- Receive notifications from users
- Store notification history

## Components 

```bash
domain/notification/
├── Notification.ts             # Entity (data structure)
├── NotificationType.ts         # Enum of notification types
├── NotificationRepository.ts   # Interface for saving & fetching
├── NotificationService.ts      # Core logic (send, mark read)
```

## Notification Entity

```ts
export interface Notification {
  id: string
  userId: string
  message: string
  type: NotificationType
  createdAt: Date
  read: boolean
}
```
