import { ChatMessage } from "../chat/ChatMessage";
import { logInfo } from "../../utils/logger";

export class PromptContextBuilder {
  static buildContext(similar: ChatMessage[], recent: ChatMessage[]): string {
    logInfo("Building prompt context", { similarCount: similar.length, recentCount: recent.length });
    const history = recent.map(m => `- ${m.content}`).join('\n');
    const matches = similar.map(m => `- ${m.content}`).join('\n');
    return `Relevant past chats:\n${matches}\n\nRecent chat:\n${history}`;
  }
}
