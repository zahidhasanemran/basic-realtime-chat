

const RoomNotFound = () => {
  return (
    <div className="bg-red-950/50 border border-red-900 p-4 text-center">
      <p className="text-red-500 text-sm font-bold">ROOM NOT FOUND</p>
      <p className="text-zinc-500 text-xs mt-1">
        This room may have expired or never existed.
      </p>
    </div>
  )
}

export default RoomNotFound