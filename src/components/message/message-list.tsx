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
    <div className="space-y-4">
      {messages.map((msg) => {
        const me = msg.sender === username

        return (
          <div
            key={msg.id}
            className={`flex w-3/4 flex-col px-3 py-3 rounded ${me ? "items-end bg-amber-100 ml-auto" : "items-start bg-blue-100 mr-auto"}`}
          >
            <div className="max-w-[80%] group">
              <div className="flex items-baseline gap-3 mb-1">
                <span className={`text-xs font-bold ${me ? "text-green-500" : "text-blue-500"}`}>
                  {me ? "YOU" : msg.sender}
                </span>

                <span className="text-[10px] text-zinc-600">
                  {format(msg.timestamp, "HH:mm")}
                </span>
              </div>

              <p className="text-sm text-black leading-relaxed break-all">
                {msg.text}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MessageList
