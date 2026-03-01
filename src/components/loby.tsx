"use client"

import { useSearchParams } from "next/navigation"
import DestroyedRoom from "@/components/room/destroyed-room"
import RoomNotFound from "@/components/room/room-not-found"
import RoomFull from "@/components/room/room-full"
import CreateRoom from "./room/create-room"

const Loby = () => {

  const searchParams = useSearchParams()
  const wasDestroyed = searchParams.get("destroyed") === "true"
  const error = searchParams.get("error")

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">

        {wasDestroyed && <DestroyedRoom />}
        {error === "room-not-found" && <RoomNotFound />}
        {error === "room-full" && <RoomFull />}

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-green-500">
            {">"}private_chat
          </h1>
          <p className="text-zinc-500 text-sm">A private, self-destructing chat room.</p>
        </div>

        <CreateRoom />

      </div>
    </main>
  )
}

export default Loby