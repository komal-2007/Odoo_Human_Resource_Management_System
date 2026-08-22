import { useState } from "react"
import EmployeeCard from "../components/EmployeeCard"
import { employees } from "../data/mockData"

export default function Employees({ onSelectEmployee }) {
  const [search, setSearch] = useState("")

  const filtered = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 space-y-6">
      {/* Toolbar: New + Search */}
      <div className="flex items-center gap-3">
        <button
          title="Add employee (coming soon)"
          className="px-4 py-2 rounded-md bg-brand-green text-base-bg text-sm font-semibold hover:bg-brand-green/90 transition-colors"
        >
          New
        </button>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search employees..."
          className="flex-1 max-w-sm bg-base-panel border border-base-border rounded-md px-3 py-2 text-sm text-ink-primary placeholder:text-ink-secondary focus:outline-none focus:border-brand-green/50"
        />
      </div>

      {/* Employee grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onClick={() => onSelectEmployee(employee.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-ink-secondary">
          No employees match "{search}".
        </p>
      )}

      {/* Status legend, per the wireframe */}
      <div className="flex items-center gap-6 pt-2 text-xs text-ink-secondary">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-green" />
          Present in the office
        </span>
        <span className="flex items-center gap-2">
          <span>✈️</span>
          On leave
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-amber" />
          Absent (no time off applied)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-ink-secondary" />
          Not clocked in
        </span>
      </div>
    </div>
  )
}
