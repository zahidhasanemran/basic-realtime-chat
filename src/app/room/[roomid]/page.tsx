"use client"

import { useGroupMessage } from "@/hooks/use-group-message"
import { useUsername } from "@/hooks/userUsername"

import { useRealtime } from "@/lib/realtime-client"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import GroupChatHeader from "@/components/group-chat/group-chat-header"
import MessageList from "@/components/message/message-list"
import GroupChatFooter from "@/components/group-chat/group-chat-footer"


const SingleRoom = () => {
  const queryClient = useQueryClient()
  const { username } = useUsername()

  const params = useParams()
  const roomId = params.roomid as string

  const { messages, isSending, inputRef, router, input, setInput, handleSendMessage, handleCopy, copyStatus, timeRemaining, destroyRoom } = useGroupMessage(roomId)

  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy"],
    onData: ({ event }) => {
      if (event === "chat.message") {
        queryClient.invalidateQueries({ queryKey: ["message-list", roomId] })
      }
      if (event === "chat.destroy") {
        router.push("/?destroyed=true")
      }
    }
  })

  return (
    <main className="mx-auto flex h-screen w-full max-w-6xl flex-col overflow-hidden px-3 py-3 sm:px-4 sm:py-4">
      <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_30px_90px_-44px_rgba(0,0,0,0.98)] backdrop-blur-2xl">
        <GroupChatHeader roomId={roomId} handleCopy={handleCopy} copyStatus={copyStatus} timeRemaining={timeRemaining} destroyRoom={destroyRoom} />
        <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4">
          <MessageList messages={messages?.messages ?? []} username={username} />
        </div>
        <GroupChatFooter input={input} inputRef={inputRef} handleSendMessage={handleSendMessage} isSending={isSending} setInput={setInput} />
      </div>
    </main>
  )
}

export default SingleRoom
