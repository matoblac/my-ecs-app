import { useState, useRef, useEffect } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';

type MessageType = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
};

const ChatWindow = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm Allen, an AI assistant created by matoblac. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (text: string) => {
    const userMessage: MessageType = {
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const responses = [
        "I understand you're working on the frontend. That sounds like an interesting project!",
        "Thanks for sharing that with me. How can I help you further?",
        "That's a great question. Let me think about that for a moment...",
        "I see what you're getting at. Here's my perspective on that:",
        "Interesting point! I'd be happy to help you explore that idea further."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const assistantMessage: MessageType = {
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#343541]">
      {/* Header */}
      <div className="bg-[#343541] border-b border-[#565869] px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-lg font-semibold text-[#ececf1]">Allen</h1>
          <p className="text-sm text-[#8e8ea0]">Model: Rapp_GroundTruth_v1</p>
        </div>
      </div>
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto py-2">
        {messages.length === 1 ? (
          // Welcome screen for empty chat
          <div className="h-full flex items-center justify-center">
            {/* ...your welcome block as before... */}
          </div>
        ) : (
          <div className="pb-32 space-y-4">
            {messages.map((message, index) => (
              <Message
                key={index}
                role={message.role}
                content={message.content}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      {/* Input Area */}
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;
