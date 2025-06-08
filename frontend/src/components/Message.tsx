type Props = {
    role: 'user' | 'assistant';
    content: string;
  };
  
  const Message = ({ role, content }: Props) => {
    return (
      <div className={`mb-2 flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`inline-block p-3 rounded-xl max-w-[70%] ${
            role === 'user' ? 'bg-[#10a37f]' : 'bg-[#444654]'
          } text-[#d1d5db]`}
        >
          {content}
        </div>
      </div>
    );
  };
  
  export default Message;
  