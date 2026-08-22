import StatusIndicator from "./StatusIndicator"

// A single employee card in the grid. Clicking it opens the read-only
// Employee Profile page for this employee.
export default function EmployeeCard({ employee, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-base-panel border border-base-border rounded-xl p-4 text-left hover:border-brand-green/40 transition-colors"
      title="View employee profile"
    >
      <div className="flex items-start justify-between mb-3">
        {/* Avatar placeholder */}
        <div className="w-14 h-14 rounded-lg bg-brand-blue/15 border border-base-border flex items-center justify-center text-xl text-brand-blue">
          👤
        </div>
        <StatusIndicator status={employee.status} />
      </div>

      <p className="text-sm font-medium">{employee.name}</p>
      <p className="text-xs text-ink-secondary mt-0.5">{employee.department}</p>
    </button>
  )
}
