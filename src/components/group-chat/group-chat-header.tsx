
import { formatTimeRemaining } from '@/lib/utils'

interface GroupChatHeaderProps {
  roomId: string,
  handleCopy: () => void,
  copyStatus: boolean,
  timeRemaining: number | null,
  destroyRoom: () => void
}

const GroupChatHeader = ({ roomId, handleCopy, copyStatus, timeRemaining, destroyRoom }: GroupChatHeaderProps) => {
  return (
    <header className="shrink-0 border-b border-border px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14rem] text-muted">
            secure room
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="max-w-[11rem] truncate rounded-full border border-border bg-surface-strong px-3 py-1 text-xs font-semibold tracking-[0.08rem] text-accent sm:max-w-none sm:text-sm">
              {roomId?.toString().slice(0, 10) + "..." || "..."}
            </span>
            <button
              onClick={handleCopy}
              className="rounded-full border border-border bg-surface-strong px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08rem] text-muted transition hover:border-accent/45 hover:text-foreground"
            >
              {copyStatus ? "Copied" : "Copy"}
            </button>
            <span
              className={`rounded-full px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08rem] ${timeRemaining !== null && timeRemaining < 60
                ? "bg-danger/18 text-danger"
                : "bg-amber-400/20 text-amber-200"
                }`}
            >
              {timeRemaining !== null ? formatTimeRemaining(timeRemaining) : "--:--"}
            </span>
          </div>
        </div>

        <button
          onClick={() => destroyRoom()}
          className="w-full rounded-2xl border border-danger/40 bg-danger/14 px-3 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08rem] text-danger transition hover:-translate-y-0.5 hover:bg-danger/20 hover:text-white disabled:opacity-50 sm:w-auto sm:px-4"
        >
          Destroy Now
        </button>
      </div>
    </header>
  )
}

export default GroupChatHeader
