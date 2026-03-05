
const RoomNotFound = () => {
  return (
    <div className="rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3 text-center backdrop-blur-md">
      <p className="text-sm font-semibold tracking-[0.11rem] text-danger">ROOM NOT FOUND</p>
      <p className="mt-1 text-xs text-[#f5c6cb]">
        This room may have expired or never existed.
      </p>
    </div>
  )
}

export default RoomNotFound
