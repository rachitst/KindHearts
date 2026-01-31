import React from "react";
import { Bot } from "lucide-react";

interface ChatMessageProps {
  chat: {
    role: "user" | "model";
    text: string;
    hideInChat?: boolean;
    isError?: boolean;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ chat }) => {
  if (chat.hideInChat) return null;

  return (
    <div
      className={`flex items-start gap-2 ${
        chat.role === "user" ? "flex-row-reverse" : ""
      }`}
    >
      {chat.role === "model" && (
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-indigo-600" />
        </div>
      )}
      <div
        className={`rounded-lg p-3 max-w-[80%] ${
          chat.role === "user"
            ? "bg-[#070530] text-white"
            : chat.isError
            ? "bg-red-50 text-red-700"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {chat.text}
      </div>
    </div>
  );
};

export default ChatMessage;
