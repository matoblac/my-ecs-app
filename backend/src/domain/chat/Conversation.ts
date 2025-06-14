// src/domain/chat/Conversation.ts
import { ChatParticipant } from "./ChatParticipant";
import { ConversationId, ConversationTitle } from "./types";

// Purpose: Defines the structure of a conversation
// This is a value object, so it is immutable
// It is used to store the conversation history


export interface Conversation {
    id: ConversationId
    title?: ConversationTitle
    createdAt: Date
    participants: ChatParticipant[]
  }
  