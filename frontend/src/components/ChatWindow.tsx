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
      content: "Hello! I'm Claude, an AI assistant created by Anthropic. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSend = (text: string) => {
    const userMessage: MessageType = {
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response (you'll replace this with actual API call later)
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

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#343541]">
      {/* Header */}
      <div className="bg-[#343541] border-b border-[#565869] px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-lg font-semibold text-[#ececf1]">Allen</h1>
          <p className="text-sm text-[#8e8ea0]">Model: Claude 4</p>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto"
      >
        {messages.length === 1 ? (
          // Welcome screen for empty chat
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="w-16 h-16 bg-[#10a37f] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#ececf1] mb-2">
                How can I help you today?
              </h2>
              <p className="text-[#8e8ea0] mb-6">
                I'm Claude, your AI assistant. I can help with writing, analysis, math, coding, creative tasks, and much more.
              </p>
              <div className="grid grid-cols-1 gap-3 text-left">
                <div className="p-3 bg-[#444654] rounded-lg border border-[#565869] hover:border-[#10a37f] transition-colors cursor-pointer">
                  <div className="text-[#ececf1] font-medium text-sm">💡 Get creative ideas</div>
                  <div className="text-[#8e8ea0] text-xs mt-1">Brainstorm concepts for your project</div>
                </div>
                <div className="p-3 bg-[#444654] rounded-lg border border-[#565869] hover:border-[#10a37f] transition-colors cursor-pointer">
                  <div className="text-[#ececf1] font-medium text-sm">📝 Help with writing</div>
                  <div className="text-[#8e8ea0] text-xs mt-1">Draft emails, essays, or documentation</div>
                </div>
                <div className="p-3 bg-[#444654] rounded-lg border border-[#565869] hover:border-[#10a37f] transition-colors cursor-pointer">
                  <div className="text-[#ececf1] font-medium text-sm">🔍 Analyze and explain</div>
                  <div className="text-[#8e8ea0] text-xs mt-1">Break down complex topics or data</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Messages list
          <div className="pb-32">
            {messages.map((message, index) => (
              <Message
                key={index}
                role={message.role}
                content={message.content}
              />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default ChatWindow;