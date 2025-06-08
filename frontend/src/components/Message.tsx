import React from 'react';

type Props = {
  role: 'user' | 'assistant';
  content: string;
};

const Message = ({ role, content }: Props) => {
  return (
    <div className={`group relative ${role === 'assistant' ? 'bg-[#444654]' : ''}`}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${
              role === 'user' 
                ? 'bg-[#10a37f] text-white' 
                : 'bg-[#19c37d] text-white'
            }`}>
              {role === 'user' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              )}
            </div>
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="text-[#ececf1] leading-7 whitespace-pre-wrap break-words">
              {content}
            </div>
          </div>

          {/* Actions (visible on hover) */}
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex gap-1">
              <button className="p-1 hover:bg-[#565869] rounded text-[#acacbe] hover:text-[#ececf1] transition-colors duration-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
              </button>
              <button className="p-1 hover:bg-[#565869] rounded text-[#acacbe] hover:text-[#ececf1] transition-colors duration-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18l-2 13H5L3 6z"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;