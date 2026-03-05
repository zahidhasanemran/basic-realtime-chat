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
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:py-14">
      <div className="w-full max-w-xl space-y-7">

        {wasDestroyed && <DestroyedRoom />}
        {error === "room-not-found" && <RoomNotFound />}
        {error === "room-full" && <RoomFull />}

        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-7 text-center shadow-[0_26px_80px_-42px_rgba(0,0,0,0.92)] backdrop-blur-2xl sm:px-9 sm:py-8">
          <div
            className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full blur-2xl"
            style={{ background: "rgba(45, 224, 184, 0.3)" }}
          />
          <div className="space-y-2">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18rem] text-muted">
              ephemeral encrypted room
            </p>
            <h1 className="font-mono text-3xl font-semibold tracking-tight text-accent sm:text-4xl">
            {">"}private_chat
            </h1>
            <p className="mx-auto max-w-md text-sm text-muted sm:text-[0.9375rem]">
              A private, self-destructing chat room.
            </p>
          </div>
        </div>

        <CreateRoom />

      </div>
    </main>
  )
}

export default Loby
