const Sidebar = () => {
  return (
    <div className="w-64 bg-[#202123] border-r border-[#3d3d3d] h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#3d3d3d]">
        <button className="w-full py-3 px-4 bg-transparent border border-[#565869] text-[#ececf1] rounded-lg hover:bg-[#2d2d30] transition-colors duration-200 flex items-center justify-center gap-2 font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New chat
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {/* Sample conversation items */}
          <div className="p-3 hover:bg-[#2d2d30] rounded-lg cursor-pointer transition-colors duration-200">
            <div className="text-[#ececf1] text-sm font-medium truncate">
              Previous conversation
            </div>
            <div className="text-[#9ca3af] text-xs mt-1">
              2 hours ago
            </div>
          </div>
          <div className="p-3 hover:bg-[#2d2d30] rounded-lg cursor-pointer transition-colors duration-200">
            <div className="text-[#ececf1] text-sm font-medium truncate">
              Another chat example
            </div>
            <div className="text-[#9ca3af] text-xs mt-1">
              Yesterday
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#3d3d3d]">
        <div className="flex items-center gap-3 p-2 hover:bg-[#2d2d30] rounded-lg cursor-pointer transition-colors duration-200">
          <div className="w-8 h-8 bg-[#10a37f] rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="flex-1 text-sm text-[#ececf1]">
            User Account
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;