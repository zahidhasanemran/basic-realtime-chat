"use client"

import { useUsername } from "@/hooks/userUsername"
import { client } from "@/lib/client"
import { useRealtime } from "@/lib/realtime-client"
import { copyToClipboard, formatTimeRemaining } from "@/lib/utils"
import { useMutation, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { useParams, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"

const SingleRoom = () => {
  const { username } = useUsername()

  const router = useRouter()
  const params = useParams()
  const roomId = params.roomid as string

  const [input, setInput] = useState("")
  const [copyStatus, setCopyStatus] = useState<boolean>(false)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)


  const { data: ttlData } = useQuery({
    queryKey: ["ttl", roomId],
    queryFn: async () => {
      const res = await client.rooms.ttl.get({ query: { roomId } })
      return res.data
    }
  })

  const { data: messages, refetch } = useQuery({
    queryKey: ["message-list", roomId],
    queryFn: async () => {
      const res = await client.messages.get({ query: { roomId } })
      return res.data
    }
  })


  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      console.log(`text: ${text}`)
      await client.messages.post({
        sender: username, text
      }, { query: { roomId } })
    },
    onSuccess: () => {
      setInput("")
      refetch()
    },
  })

  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      await client.rooms.delete(null, { query: { roomId } })
    }
  })

  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy"],
    onData: ({ event }) => {
      if (event === "chat.message") {
        refetch()
      }
      if (event === "chat.destroy") {
        router.push("/?destroyed=true")
      }


    }

  })


  const handleCopy = async () => {
    await copyToClipboard()
    setCopyStatus(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => { setCopyStatus(false) }, 2000)

  }

  useEffect(() => {
    if (ttlData?.ttl !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeRemaining(ttlData.ttl)
    }
  }, [ttlData?.ttl])

  useEffect(() => {
    if (!timeRemaining) return
    if (timeRemaining < 1 || timeRemaining === 0) {
      router.push("/?destroyed=true")
    }
    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev > 0 ? prev - 1 : 0)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, router])


  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden">
      <header className="border-b border-zinc-800 p-4 flex items-center justify-between bg-zinc-900/30">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase">Room ID</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-green-500 truncate">
                {roomId?.toString().slice(0, 10) + "..." || "..."}
              </span>
              <button
                onClick={handleCopy}
                className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                {copyStatus ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className="h-8 w-px bg-zinc-800" />

          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase">Self-Destruct</span>
            <span
              className={`text-sm font-bold flex items-center gap-2 ${timeRemaining !== null && timeRemaining < 60
                ? "text-red-500"
                : "text-amber-500"
                }`}
            >
              {timeRemaining !== null ? formatTimeRemaining(timeRemaining) : "--:--"}
            </span>
          </div>
        </div>

        <button
          onClick={() => destroyRoom()}
          className="text-xs bg-zinc-800 hover:bg-red-600 px-3 py-1.5 rounded text-zinc-400 hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50"
        >
          <span className="group-hover:animate-pulse">💣</span>
          DESTROY NOW
        </button>
      </header>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages?.messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-600 text-sm font-mono">
              No messages yet, start the conversation.
            </p>
          </div>
        )}

        {messages?.messages.map((msg) => {
          const me = msg.sender == username
          return (
            (
              <div key={msg.id} className={`flex w-3/4 flex-col px-3 py-3 rounded  ${me ? "items-end bg-amber-100 ml-auto" : "items-start bg-blue-100 mr-auto"}`}>
                <div className="max-w-[80%] group">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span
                      className={`text-xs font-bold ${me ? "text-green-500" : "text-blue-500"
                        }`}
                    >
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
          )
        })}
      </div>

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
                if (e.key === "Enter" && input.trim()) {
                  sendMessage({ text: input })
                  inputRef.current?.focus()
                }
              }}
              placeholder="Type message..."
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-black border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors text-zinc-100 placeholder:text-zinc-700 py-3 pl-8 pr-4 text-sm"
            />
          </div>

          <button
            onClick={() => {
              sendMessage({ text: input })
              inputRef.current?.focus()
            }}
            // disabled={!input.trim() || isPending}
            className="bg-zinc-800 text-zinc-400 px-6 text-sm font-bold hover:text-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            SEND
          </button>
        </div>
      </div>
    </main>
  )
}

export default SingleRoom