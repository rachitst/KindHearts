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
You are Sahayak, an AI assistant for the Institute Dashboard of the KindHearts platform.
Your role is to help institutes manage their donation requests and track deliveries.

**Strict Guidelines:**
1.  **Platform Only**: You must ONLY provide information about the KindHearts platform (Institute features). Do not answer general questions about the world, weather, or external topics.
2.  **Plain Text**: Provide responses in simple, normal text. Do NOT use markdown headers (#, ##), bolding (**), or bullet points unless absolutely necessary. Keep it conversational and professional.
3.  **Concise**: Keep answers short and specific to the institute's needs.
4.  **No External Instructions**: Do NOT tell users to search on Google or visit other websites.

**Key Features for Institutes:**
*   **Raise Request**: Create new requests for items (Food, Medical, etc.).
*   **Track Status**: Monitor requests (Pending -> Processing -> Delivered -> Completed).
*   **Confirm Delivery**: Verify and confirm receipt of items.
*   **My Requests**: View history of all requests.

**Common Queries:**
*   "How do I raise a request?" -> Explain the "Raise Request" page form.
*   "How to confirm delivery?" -> Go to "Confirm Delivery", select the item, and upload proof/OTP.
*   "My request is pending" -> Explain that it's waiting for a shopkeeper assignment.
*   "Guide me to search NGOs" -> "As an institute, you can view your own requests and status. To see other NGOs or donors, please use the main platform search features if available."

If asked about unrelated topics, politely decline and focus on the dashboard features.
`;

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Hello! I'm Sahayak, your Institute Dashboard assistant. How can I help you today?",
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
    // Filter out "Thinking...." messages and format for API
    const formattedHistory = history
      .filter(msg => msg.text !== "Thinking....")
      .map(({ role, text }) => ({
        role: role === 'model' ? 'assistant' : 'user',
        content: text
      }));

    const requestOptions = {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
      },
      body: JSON.stringify({ 
        model: `${import.meta.env.VITE_GROQ_MODEL || 'mixtral-8x7b-32768'}`, // Fallback if env not set
        messages: [
          { role: "system", content: ASSISTANT_PROMPT },
          ...formattedHistory
        ]
      }),
    };

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to get response");
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;

      setChatHistory((prev) => {
        // Remove "Thinking...." and add real response
        const newHistory = prev.filter(msg => msg.text !== "Thinking....");
        return [...newHistory, { role: "model", text: botResponse }];
      });
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prev) => {
        const newHistory = prev.filter(msg => msg.text !== "Thinking....");
        return [...newHistory, {
          role: "model",
          text: "I apologize, but I'm having trouble connecting right now. Please try again later.",
          isError: true,
        }];
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[500px] flex flex-col animate-fadeIn">
          <div className="bg-[#100e92] text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} />
              <h3 className="font-medium">Sahayak Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          >
            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>

          <div className="border-t p-4 bg-white rounded-b-lg">
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
          className="bg-[#100e92] text-white p-3 rounded-full shadow-lg hover:bg-[#0d0940] transition-all transform hover:scale-105"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
