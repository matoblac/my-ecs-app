import { NotificationType } from "./NotificationType"

export interface Notification {
    id: string
    userId: string
    message: string
    type: NotificationType
    createdAt: Date
    read: boolean
    updatedAt?: Date
}
  