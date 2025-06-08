import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput = ({ onSend }: ChatInputProps) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [text]);

  return (
    <div className="border-t border-[#565869] bg-[#343541]">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-3 bg-[#40414f] rounded-xl border border-[#565869] focus-within:border-[#10a37f] transition-colors duration-200">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              className="flex-1 bg-transparent text-[#ececf1] placeholder-[#8e8ea0] border-0 outline-none resize-none px-4 py-3 min-h-[24px] max-h-[200px] leading-6"
              rows={1}
            />
            
            <div className="flex items-center gap-2 pr-3 pb-3">
              {/* Send Button */}
              <button
                type="submit"
                disabled={!text.trim()}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  text.trim()
                    ? 'bg-[#10a37f] hover:bg-[#0d8f65] text-white'
                    : 'bg-[#565869] text-[#8e8ea0] cursor-not-allowed'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Character count or helpful text */}
          <div className="text-xs text-[#8e8ea0] mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;