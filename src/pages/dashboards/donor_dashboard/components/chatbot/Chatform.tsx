import React, { useRef } from 'react';
import { ChatMessage } from './chatbot'; // Import the ChatMessage type

interface ChatformProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  generateBotResponse: (history: ChatMessage[]) => Promise<void>;
}

const Chatform: React.FC<ChatformProps> = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = inputRef.current?.value.trim();
    if (!userMessage) return;
    
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setChatHistory(history => [...history, { role: "user", text: userMessage }]);

    setTimeout(() => {
      setChatHistory(history => [...history, { role: "model", text: "Thinking...." }]);
      generateBotResponse([...chatHistory, { 
        role: "user", 
        text: `Using the details provided above, please address this query: ${userMessage}` 
      }]);
    }, 600);
  };

  return (
    <div>
      <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
        <input 
          ref={inputRef}
          type="text"
          placeholder="message"
          className="message-input"
          required
        />
        <button className="material-symbols-rounded">arrow_upward</button>
      </form>
    </div>
  );
};

export default Chatform; 