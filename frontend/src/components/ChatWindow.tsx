import { useState, useRef, useEffect } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';

type MessageType = {
  role: 'user' | 'assistant';
  content: string;
};

const ChatWindow = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    { role: 'assistant', content: 'Hello! How can I help?' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = (text: string) => {
    setMessages([...messages, { role: 'user', content: text }]);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-[#343541]">
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} content={msg.content} />
        ))}
        <div ref={scrollRef} />
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;
