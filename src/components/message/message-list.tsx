import { format } from "date-fns"
import NoMessageYet from "./no-message"

interface MessageItem {
  id: string
  sender: string
  text: string
  timestamp: number
}

interface MessageListProps {
  messages: MessageItem[]
  username: string
}

const MessageList = ({ messages, username }: MessageListProps) => {
  if (messages.length === 0) {
    return <NoMessageYet />
  }

  return (
    <div className="space-y-3 pb-2">
      {messages.map((msg) => {
        const me = msg.sender === username

        return (
          <div
            key={msg.id}
            className={`flex ${me ? "justify-end" : "justify-start"}`}
          >
            <article
              className={`max-w-[88%] rounded-2xl border px-3 py-2.5 sm:max-w-[75%] sm:px-4 sm:py-3 ${me
                ? "border-accent/35 bg-accent/16"
                : "border-border bg-surface-strong"
                }`}
            >
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <span className={`truncate text-[0.6875rem] font-semibold uppercase tracking-[0.08rem] ${me ? "text-accent" : "text-[#8bd9ff]"}`}>
                  {me ? "You" : msg.sender}
                </span>

                <span className="text-[0.625rem] text-muted">
                  {format(msg.timestamp, "HH:mm")}
                </span>
              </div>

              <p className="break-words text-sm leading-relaxed text-foreground">
                {msg.text}
              </p>
            </article>
          </div>
        )
      })}
    </div>
  )
}

export default MessageList
