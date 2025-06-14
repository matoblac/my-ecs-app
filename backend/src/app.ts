import express, { Request, Response, RequestHandler } from "express";
import { ChatApplicationService } from "./application/ChatApplicationService";
import { ChatService } from "./domain/chat/ChatService";
import { ChatMessageRepositoryAurora } from "./infrastructure/database/aurora/ChatMessageRepositoryAurora";
import { AuroraDataSource } from "./infrastructure/database/aurora/AuroraSource";
import { AiService } from "./domain/ai/AiService";
import { AwsBedrockClient } from "./infrastructure/bedrock/BedrockClient";
import { DatabaseError, NotFoundError } from "./utils/errors";

// 1. Infrastructure
const db = new AuroraDataSource();
const chatRepo = new ChatMessageRepositoryAurora(db);
const bedrockClient = new AwsBedrockClient();

// 2. Domain
const aiService = new AiService(bedrockClient);
const chatService = new ChatService(chatRepo, aiService);

// 3. Application
const chatAppService = new ChatApplicationService(chatService, aiService);

// 4. HTTP Layer
const app = express();
app.use(express.json());

const chatHandler: RequestHandler = async (req: Request, res: Response) => {
  const { userId, conversationId, content } = req.body;

  try {
    const result = await chatAppService.handleUserMessage(userId, conversationId, content);
    res.json(result);
  } catch (err: unknown) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    if (err instanceof DatabaseError) {
      res.status(503).json({ error: "Database error", details: err.message });
      return;
    }
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

app.post("/chat", chatHandler);

export default app;
