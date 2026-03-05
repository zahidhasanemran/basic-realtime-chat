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
    <div className="shrink-0 border-t border-border px-3 py-3 sm:px-4 sm:py-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-accent">
            {'>'}
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
            className="w-full rounded-2xl border border-border bg-surface-strong py-3 pl-8 pr-3 text-sm text-foreground placeholder:text-muted/80 outline-none transition focus:border-accent/55"
          />
        </div>

        <button
          onClick={handleSendMessage}
          disabled={!input.trim() || isSending}
          className="rounded-2xl border border-accent/65 bg-accent px-4 py-3 text-xs font-semibold uppercase tracking-[0.08rem] text-[#022920] transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default GroupChatFooter
