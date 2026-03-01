import Loby from "@/components/loby"
import { Suspense } from "react"

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Loby />
    </Suspense>
  )
}

