// Renders the small status indicator shown at the top-right corner
// of each employee card, per the wireframe's legend:
//   present        -> green dot
//   on-leave       -> plane icon
//   absent         -> yellow dot
//   not-clocked-in -> empty ring

export default function StatusIndicator({ status }) {
  if (status === "present") {
    return (
      <span
        className="w-3 h-3 rounded-full bg-brand-green"
        title="Present in the office"
      />
    )
  }

  if (status === "on-leave") {
    return (
      <span title="On leave" className="text-brand-blue text-sm leading-none">
        ✈️
      </span>
    )
  }

  if (status === "absent") {
    return (
      <span
        className="w-3 h-3 rounded-full bg-brand-amber"
        title="Absent — no time off applied"
      />
    )
  }

  // "not-clocked-in" — empty ring
  return (
    <span
      className="w-3 h-3 rounded-full border-2 border-ink-secondary"
      title="Not clocked in yet"
    />
  )
}
