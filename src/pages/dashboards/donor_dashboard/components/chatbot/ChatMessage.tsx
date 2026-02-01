import React from 'react';
import { Bot } from 'lucide-react';

interface ChatMessageProps {
  chat: {
    hideInChat?: boolean;
    role: "user" | "model";
    text: string;
    isError?: boolean;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ chat }) => {
  return !chat.hideInChat ? (
    <div className={`message ${chat.role === "model" ? 'bot' : 'user'}-message ${chat.isError ? "error" : ""}`}>
      {chat.role === "model" && <Bot className="w-8 h-8 text-indigo-600" />}
      <div className="message-text">{chat.text}</div>
    </div>
  ) : null;
};

export default ChatMessage; 