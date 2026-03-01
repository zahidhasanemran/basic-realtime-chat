import React from 'react'

interface GroupChatFooterProps {
  input: string,
  inputRef: React.RefObject<HTMLInputElement | null>,
  handleSendMessage: () => void,
  isSending: boolean
  setInput: (value: string) => void
}

const GroupChatFooter = ({ input, inputRef, handleSendMessage, isSending, setInput }: GroupChatFooterProps) => {
  return (
    <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
      <div className="flex gap-4">
        <div className="flex-1 relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 animate-pulse">
            {">"}
          </span>
          <input
            autoFocus
            type="text"
            value={input}
            ref={inputRef}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Type message..."
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-black border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors text-zinc-100 placeholder:text-zinc-700 py-3 pl-8 pr-4 text-sm"
          />
        </div>

        <button
          onClick={handleSendMessage}
          disabled={!input.trim() || isSending}
          className="bg-zinc-800 text-zinc-400 px-6 text-sm font-bold hover:text-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          SEND
        </button>
      </div>
    </div>
  )
}

export default GroupChatFooter