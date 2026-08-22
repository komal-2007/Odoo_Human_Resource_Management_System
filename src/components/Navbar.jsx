import { useState } from "react"

// "Employees" and "Attendance" are wired up for navigation now.
// "Time Off" is shown so the nav looks complete, but doesn't
// navigate anywhere yet — that's the next screen to build.
const navItems = [
  { label: "Employees", page: "employees", active: true },
  { label: "Attendance", page: "attendance", active: true },
  { label: "Time Off", page: "timeoff", active: true },
]

export default function Navbar({ currentPage, onNavigate, checkedIn }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="h-14 bg-base-sidebar border-b border-base-border flex items-center px-4 gap-2 relative">
      {/* Logo */}
      <div className="flex items-center gap-2 pr-4 mr-2 border-r border-base-border h-full">
        <div className="w-7 h-7 rounded-md bg-brand-green flex items-center justify-center font-display font-bold text-sm text-base-bg">
          D
        </div>
        <span className="font-display font-semibold text-base tracking-tight">
          Dayflow
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            disabled={!item.active}
            onClick={() => item.active && onNavigate(item.page)}
            title={item.active ? undefined : "Coming soon"}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${
                item.active && currentPage === item.page
                  ? "bg-brand-green/10 text-brand-green"
                  : item.active
                  ? "text-ink-secondary hover:bg-base-panel"
                  : "text-ink-secondary hover:bg-base-panel cursor-not-allowed"
              }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right side: avatar + status dot + dropdown */}
      <div className="ml-auto relative">
        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="flex items-center gap-2"
        >
          {/* Status dot reflects the Check In/Check Out widget */}
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              checkedIn ? "bg-brand-green" : "bg-brand-red"
            }`}
          />
          <span className="w-8 h-8 rounded-full bg-brand-blue/20 border border-base-border flex items-center justify-center text-xs font-medium">
            A
          </span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-base-panel border border-base-border rounded-lg shadow-lg overflow-hidden z-10">
            <button
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-base-sidebar transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              My Profile
            </button>
            <button
              className="w-full text-left px-4 py-2.5 text-sm text-brand-red hover:bg-base-sidebar transition-colors border-t border-base-border"
              onClick={() => setMenuOpen(false)}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
