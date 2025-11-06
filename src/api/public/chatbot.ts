// src/api/public/chatbot.ts
import { apiPost } from "../client";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

export interface ChatResponse {
  message: string;
}

export async function sendChatMessage(
  request: ChatRequest,
): Promise<ChatResponse> {
  return apiPost<ChatResponse>("/api/chatbot/chat", request);
}
