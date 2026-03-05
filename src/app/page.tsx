import Loby from "@/components/loby"
import { Suspense } from "react"

export default function Home() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-muted">Loading chat...</div>}>
      <Loby />
    </Suspense>
  )
}
