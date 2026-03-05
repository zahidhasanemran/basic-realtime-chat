import { client } from "@/lib/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useUsername } from "./userUsername"
import { useEffect, useRef, useState } from "react"
import { copyToClipboard } from "@/lib/utils"
import { useRouter } from "next/navigation"

export const useGroupMessage = (roomId: string) => {

  const router = useRouter()
  const queryClient = useQueryClient()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [input, setInput] = useState("")
  const [copyStatus, setCopyStatus] = useState<boolean>(false)
  const [now, setNow] = useState<number>(0)

  const { username } = useUsername()

  const handleCopy = async () => {
    await copyToClipboard()
    setCopyStatus(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => { setCopyStatus(false) }, 2000)

  }

  const handleSendMessage = () => {
    const text = input.trim()
    if (!text || !username || isSending) return
    sendMessage({ text })
    inputRef.current?.focus()
  }

  const { data: ttlData, dataUpdatedAt: ttlUpdatedAt } = useQuery({
    queryKey: ["ttl", roomId],
    enabled: !!roomId,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
    queryFn: async () => {
      const res = await client.rooms.ttl.get({ query: { roomId } })
      return res.data
    }
  })

  const { data: messages, refetch: messageListRefetch } = useQuery({
    queryKey: ["message-list", roomId],
    enabled: !!roomId,
    queryFn: async () => {
      const res = await client.messages.get({ query: { roomId } })
      return res.data
    }
  })


  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      await client.messages.post({
        sender: username,
        text
      }, { query: { roomId } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-list", roomId] })
      setInput("")
    },
  })

  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      await client.rooms.delete(null, { query: { roomId } })
    }
  })

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const effectiveNow = now === 0 ? ttlUpdatedAt : now

  const timeRemaining = ttlData?.ttl === undefined
    ? null
    : Math.max(ttlData.ttl - Math.floor((effectiveNow - ttlUpdatedAt) / 1000), 0)

  useEffect(() => {
    if (timeRemaining === null) return
    if (timeRemaining <= 0) {
      router.push("/?destroyed=true")
    }
  }, [timeRemaining, router])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    messages,
    messageListRefetch,
    isSending,
    destroyRoom,

    inputRef,
    timeRemaining,

    copyStatus,
    handleCopy,
    handleSendMessage, 

    input,
    setInput,
    router
  }
  
}
