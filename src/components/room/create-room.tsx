import { useMutation } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { useUsername } from "@/hooks/userUsername"
import { useRouter } from "next/navigation"

const CreateRoom = () => {

  const router = useRouter()
  const { username } = useUsername()

  const { mutate: createRoom, isPending } = useMutation({
    mutationFn: async () => {
      const response = await client.rooms.create.post()
      return response.data
    },
    onSuccess: (data) => {
      router.push(`/room/${data?.roomId}`)
    },
    onError: (error) => {
      console.log("Error creating room", error)
    }
  })
  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-[0_30px_70px_-42px_rgba(0,0,0,1)] backdrop-blur-2xl sm:p-7">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center text-2xl font-semibold tracking-tight text-foreground">Your Identity</label>
          <p className="text-xs uppercase tracking-[0.14rem] text-muted">auto-generated alias</p>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent">
              ID
            </div>
            <div className="flex-1 rounded-2xl border border-border bg-surface-strong px-4 py-3 text-sm font-medium text-foreground">
              {username}
            </div>
          </div>
        </div>

        <button
          onClick={() => createRoom()}
          className="mt-1 w-full rounded-2xl border border-accent/70 bg-accent px-4 py-3 text-sm font-semibold text-[#022920] transition hover:-translate-y-0.5 hover:bg-accent-strong hover:shadow-[0_16px_28px_-18px_rgba(45,224,184,0.95)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "CREATING..." : "CREATE SECURE ROOM"}
        </button>
      </div>
    </div>
  )
}

export default CreateRoom
