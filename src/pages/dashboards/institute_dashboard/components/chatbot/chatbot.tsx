import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import ChatMessage from "./ChatMessage";
import Chatform from "./Chatform";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  hideInChat?: boolean;
  isError?: boolean;
}

const ASSISTANT_PROMPT = `
You are Sahayata, an AI assistant for the Institute Dashboard platform.
Your role is to help institutes manage their donation requests and track deliveries effectively.

🏫 **Institute Management:**
- Guide users through raising new donation requests
- Help track existing request statuses
- Assist with delivery confirmations
- Explain registration and verification processes
- Support profile management and updates

📝 **Request Management:**
- Explain how to fill request forms correctly
- Help understand request priorities and urgency levels
- Guide through document upload requirements
- Assist with request modifications or cancellations
- Explain request approval processes

📦 **Delivery Handling:**
- Guide through delivery confirmation process
- Help with scheduling and rescheduling deliveries
- Explain delivery verification requirements
- Assist with feedback submission
- Handle delivery-related queries

📊 **Dashboard Features:**
- Help navigate through different sections
- Explain statistics and reports
- Guide through history and past requests
- Assist with notification settings
- Help with account management

⚠️ Always maintain confidentiality and only provide accurate information based on the platform's features.
Respond to queries professionally and guide users to appropriate platform features.
`;

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Hello! I'm Sahayata, your Institute Dashboard assistant. How can I help you today?",
    },
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const generateBotResponse = async (history: ChatMessage[]) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    ASSISTANT_PROMPT +
                    "\n\n" +
                    history.map((msg) => `${msg.role}: ${msg.text}`).join("\n"),
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const botResponse = data.candidates[0].content.parts[0].text;

      setChatHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = {
          role: "model",
          text: botResponse,
        };
        return newHistory;
      });
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = {
          role: "model",
          text: "I apologize, but I'm having trouble connecting right now. Please try again later.",
          isError: true,
        };
        return newHistory;
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[500px] flex flex-col">
          <div className="bg-[#070530] text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Sahayata Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>

          <div className="border-t p-4">
            <Chatform
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#070530] text-white p-3 rounded-full shadow-lg hover:bg-[#0d0940] transition-colors"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
