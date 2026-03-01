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
    <main className="flex flex-col h-screen max-h-screen overflow-hidden">
      <GroupChatHeader roomId={roomId} handleCopy={handleCopy} copyStatus={copyStatus} timeRemaining={timeRemaining} destroyRoom={destroyRoom} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        <MessageList messages={messages?.messages ?? []} username={username} />
      </div>
      <GroupChatFooter input={input} inputRef={inputRef} handleSendMessage={handleSendMessage} isSending={isSending} setInput={setInput} />
    </main>
  )
}

export default SingleRoom
