
const RoomFull = () => {
  return (
    <div className="rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3 text-center backdrop-blur-md">
      <p className="text-sm font-semibold tracking-[0.11rem] text-danger">ROOM FULL</p>
      <p className="mt-1 text-xs text-[#f5c6cb]">
        This room is at maximum capacity.
      </p>
    </div>
  )
}

export default RoomFull
