import { useState } from "react"
import { employees } from "../data/mockData"
import { getAttendanceForDate } from "../data/attendanceData"
import StatusIndicator from "../components/StatusIndicator"
import CheckInOutWidget from "../components/CheckInOutWidget"

function toDateKey(date) {
  return date.toISOString().slice(0, 10) // "YYYY-MM-DD"
}

function formatDisplayDate(date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function Attendance({ checkedIn, since, onCheckIn, onCheckOut }) {
  const [search, setSearch] = useState("")
  // Mock "today" matches the seeded data so the page has something
  // realistic to show on first load.
  const [selectedDate, setSelectedDate] = useState(new Date("2026-08-22"))

  const dateKey = toDateKey(selectedDate)
  const employeeIds = employees.map((emp) => emp.id)
  const attendanceForDate = getAttendanceForDate(dateKey, employeeIds)

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  )

  function shiftDate(days) {
    const next = new Date(selectedDate)
    next.setDate(next.getDate() + days)
    setSelectedDate(next)
  }

  return (
    <div className="p-8 space-y-6">
      {/* Toolbar: date nav, search, check-in widget */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-base-panel border border-base-border rounded-md">
          <button
            onClick={() => shiftDate(-1)}
            className="px-3 py-2 text-sm text-ink-secondary hover:text-ink-primary transition-colors"
            title="Previous day"
          >
            ←
          </button>
          <span className="px-2 text-sm font-medium whitespace-nowrap">
            {formatDisplayDate(selectedDate)}
          </span>
          <button
            onClick={() => shiftDate(1)}
            className="px-3 py-2 text-sm text-ink-secondary hover:text-ink-primary transition-colors"
            title="Next day"
          >
            →
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search employees..."
          className="flex-1 max-w-sm bg-base-panel border border-base-border rounded-md px-3 py-2 text-sm text-ink-primary placeholder:text-ink-secondary focus:outline-none focus:border-brand-green/50"
        />

        <div className="ml-auto">
          <CheckInOutWidget
            checkedIn={checkedIn}
            since={since}
            onCheckIn={onCheckIn}
            onCheckOut={onCheckOut}
          />
        </div>
      </div>

      {/* Attendance table */}
      <div className="bg-base-panel border border-base-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-base-border text-left text-xs text-ink-secondary">
              <th className="px-5 py-3 font-medium">Employee</th>
              <th className="px-5 py-3 font-medium">Check In</th>
              <th className="px-5 py-3 font-medium">Check Out</th>
              <th className="px-5 py-3 font-medium">Work Hours</th>
              <th className="px-5 py-3 font-medium">Extra Hours</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => {
              const record = attendanceForDate[emp.id]
              return (
                <tr
                  key={emp.id}
                  className="border-b border-base-border last:border-0"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <StatusIndicator status={record.status} />
                      <div>
                        <p className="font-medium">{emp.name}</p>
                        <p className="text-xs text-ink-secondary">
                          {emp.department}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink-secondary">
                    {record.checkIn ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-ink-secondary">
                    {record.checkOut ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-ink-secondary">
                    {record.workHours ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-ink-secondary">
                    {record.extraHours ?? "—"}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filteredEmployees.length === 0 && (
          <p className="text-sm text-ink-secondary px-5 py-6">
            No employees match "{search}".
          </p>
        )}
      </div>

      {/* Status legend — same convention as the Employees page */}
      <div className="flex items-center gap-6 text-xs text-ink-secondary">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-green" />
          Checked in
        </span>
        <span className="flex items-center gap-2">
          <span>✈️</span>
          On leave
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-amber" />
          Absent
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-ink-secondary" />
          Not checked in
        </span>
      </div>
    </div>
  )
}
