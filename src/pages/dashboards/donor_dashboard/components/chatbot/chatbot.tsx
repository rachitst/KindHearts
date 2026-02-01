import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import { MessageCircle, X, Send, Bot, HeartHandshake } from 'lucide-react';
import Chatform from "./Chatform";
import { trackerinfo } from "./trackerinfo";
import './chatbot.css';

interface ChatMessage {
  hideInChat?: boolean;
  role: "user" | "model";
  text: string;
  isError?: boolean;
}

interface ApiResponse {
  candidates: [{
    content: {
      parts: [{
        text: string;
      }];
    };
  }];
  error?: {
    message: string;
  };
}

const Chatbot: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([{
    hideInChat: true,
    role: "model",
    text: trackerinfo,
  }]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const generateBotResponse = async (history: ChatMessage[]) => {
    const updateHistory = (text: string, isError: boolean = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking...."), { role: "model", text, isError }]);
    };

    const formattedHistory = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: formattedHistory }),
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data: ApiResponse = await response.json();
      
      if (!response.ok) throw new Error(data.error?.message || "Something went wrong!");
      
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory((error as Error).message, true);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [chatHistory]);

  return (
    <div className={`chatbot-container ${showChatbot ? "show-chatbot" : ""}`}>
      <button 
        onClick={() => setShowChatbot(prev => !prev)} 
        className="chatbot-toggle"
        aria-label="Toggle chat"
      >
        {showChatbot ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      <div className="chatbot-window">
        <div className="chat-header">
          <div className="header-info">
            <HeartHandshake className="w-6 h-6 text-indigo-600" />
            <div>
              <h2 className="text-lg font-medium">Sahayak</h2>
              <p className="text-sm text-gray-500">Empowering Kindness</p>
            </div>
          </div>
          <button 
            onClick={() => setShowChatbot(false)}
            className="close-button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <HeartHandshake className="w-8 h-8 text-indigo-600" />
            <div className="message-text">
              <p>Namaste! 🙏</p>
              <p>I'm Sahayak, your donation assistant. How can I help you today?</p>
            </div>
          </div>
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="chat-footer">
          <Chatform 
            chatHistory={chatHistory} 
            setChatHistory={setChatHistory} 
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatbot; 