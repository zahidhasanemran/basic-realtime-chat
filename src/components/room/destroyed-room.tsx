

const DestroyedRoom = () => {
  return (
    <div className="bg-red-950/50 border border-red-900 p-4 text-center">
      <p className="text-red-500 text-sm font-bold">ROOM DESTROYED</p>
      <p className="text-zinc-500 text-xs mt-1">
        All messages were permanently deleted.
      </p>
    </div>
  )
}

export default DestroyedRoom