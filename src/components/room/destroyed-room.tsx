
const DestroyedRoom = () => {
  return (
    <div className="rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3 text-center backdrop-blur-md">
      <p className="text-sm font-semibold tracking-[0.11rem] text-danger">ROOM DESTROYED</p>
      <p className="mt-1 text-xs text-[#f5c6cb]">
        All messages were permanently deleted.
      </p>
    </div>
  )
}

export default DestroyedRoom
