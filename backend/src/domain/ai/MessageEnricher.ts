import { ChatMessage } from "../chat/ChatMessage";
import { logInfo } from "../../utils/logger";

// This is a stub for the MessageEnricher interface. 
// This MessageEnricher would be launched from the backend and would be used to enrich the user's messages before they are sent to the LLM.
// It is initiated by LLMClient.chat()

export interface EnrichedChatMessage extends ChatMessage {
  enrichedAt: Date;
}

export function enrichMessage(msg: ChatMessage): EnrichedChatMessage {
  logInfo("Enriching message", { id: msg.id });
  return { ...msg, enrichedAt: new Date() };
}
