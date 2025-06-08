type Props = {
  role: 'user' | 'assistant';
  content: string;
};

const Message = ({ role, content }: Props) => {
  // User on right, Assistant on left
  const isUser = role === 'user';

  return (
    <div className={`flex gap-4 items-start ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div 
        data-testid={role === 'user' ? 'user-icon' : 'assistant-icon'}
        className="w-8 h-8 rounded-full flex items-center justify-center
          text-white
          shadow
          select-none
          font-bold
          text-lg
          shrink-0
          "
          style={{
            background: isUser ? '#10a37f' : '#19c37d'
          }}>
          {isUser ? (
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
        {/* Bubble */}
        <div className={`
          inline-block
          px-4 py-2
          rounded-2xl
          max-w-[80%]
          break-words
          leading-6
          whitespace-pre-wrap
          shadow
          transition-all duration-200
          ${isUser
            ? 'bg-[#10a37f] text-white ml-auto'
            : 'bg-[#444654] text-[#ececf1] mr-auto'
          }
        `}>
          {content}
        </div>
      </div>
    );
  };

  export default Message;
