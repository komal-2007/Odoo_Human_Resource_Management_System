// Small reusable Check In / Check Out widget.
// It's fully controlled by props — no internal state — so wiring it
// up to a real check-in API later is just replacing what onCheckIn /
// onCheckOut do in the parent, not touching this component at all.

export default function CheckInOutWidget({ checkedIn, since, onCheckIn, onCheckOut }) {
  return (
    <div className="bg-base-panel border border-base-border rounded-lg px-4 py-2.5 flex items-center gap-3">
      <div>
        <p className="text-sm font-medium">
          {checkedIn ? "Checked In" : "Not Checked In"}
        </p>
        {checkedIn && since && (
          <p className="text-xs text-ink-secondary">Since {since}</p>
        )}
      </div>

      {checkedIn ? (
        <button
          onClick={onCheckOut}
          className="text-xs font-semibold px-3 py-1.5 rounded-md bg-brand-red/10 text-brand-red hover:bg-brand-red/20 transition-colors whitespace-nowrap"
        >
          Check Out →
        </button>
      ) : (
        <button
          onClick={onCheckIn}
          className="text-xs font-semibold px-3 py-1.5 rounded-md bg-brand-green/10 text-brand-green hover:bg-brand-green/20 transition-colors whitespace-nowrap"
        >
          Check In →
        </button>
      )}
    </div>
  )
}
