import { useState } from 'react';

const ChatInput = ({ onSend }: { onSend: (msg: string) => void }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-[#40414f] border-t border-[#3d3d3d]">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full p-3 rounded border-none bg-[#553] text-[#d1d5db] outline-none placeholder:text-[#3d3d3d]"
        placeholder="Send a message..."
      />
    </form>
  );
};

export default ChatInput;
