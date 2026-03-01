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
    <div className="border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="flex items-center text-white text-2xl ">Your Identity</label>

          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white  border border-zinc-800 p-4 rounded  text-sm text-black font-mono">
              {username}
            </div>
          </div>
        </div>

        <button
          onClick={() => createRoom()}
          className="w-full bg-zinc-100 rounded text-black p-3 text-sm font-bold hover:bg-zinc-50 hover:text-black transition-colors mt-2 cursor-pointer disabled:opacity-50"
        >
          {isPending ? "CREATING..." : "CREATE SECURE ROOM"}
        </button>
      </div>
    </div>
  )
}

export default CreateRoom