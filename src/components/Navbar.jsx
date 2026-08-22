import { useState } from "react"

// "Employees" and "Attendance" are wired up for navigation now.
// "Time Off" is shown so the nav looks complete, but doesn't
// navigate anywhere yet — that's the next screen to build.
const navItems = [
  { label: "Employees", page: "employees", active: true },
  { label: "Attendance", page: "attendance", active: true },
  { label: "Time Off", page: "timeoff", active: true },
]

export default function Navbar({ currentPage, onNavigate, checkedIn, currentUser, onLogout, onToggleRole }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const initial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"
  const isAdmin = currentUser?.role === "admin"

  return (
    <header className="h-14 bg-base-sidebar border-b border-base-border flex items-center px-4 gap-2 relative">
      {/* Logo */}
      <div className="flex items-center gap-2 pr-4 mr-2 border-r border-base-border h-full">
        <div className="w-7 h-7 rounded-md bg-purple-600 flex items-center justify-center font-display font-bold text-sm text-white shadow-sm">
          D
        </div>
        <div className="flex flex-col">
          <span className="font-display font-bold text-base tracking-tight leading-none text-ink-primary">
            DayFlow
          </span>
          {currentUser?.company && (
            <span className="text-[10px] text-ink-secondary leading-tight truncate max-w-[120px]">
              {currentUser.company}
            </span>
          )}
        </div>
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
                  ? "bg-purple-600/15 text-purple-400 font-semibold"
                  : item.active
                  ? "text-ink-secondary hover:bg-base-panel hover:text-ink-primary"
                  : "text-ink-secondary hover:bg-base-panel cursor-not-allowed"
              }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right side: Quick Demo Role Switcher + Avatar + Status */}
      <div className="ml-auto flex items-center gap-3">
        {/* Quick Role Toggle Button for Demo */}
        <button
          onClick={onToggleRole}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
            isAdmin
              ? "bg-purple-600/15 text-purple-300 border-purple-500/30 hover:bg-purple-600/25"
              : "bg-blue-600/15 text-blue-300 border-blue-500/30 hover:bg-blue-600/25"
          }`}
          title="Click to switch between Admin and Employee view"
        >
          <span>{isAdmin ? "👑 Admin View" : "👤 Employee View"}</span>
          <span className="text-[10px] opacity-70 bg-base-sidebar px-1.5 py-0.5 rounded-full border border-base-border">
            Switch
          </span>
        </button>

        {/* User avatar & dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-base-panel transition-colors"
          >
            {/* Status dot */}
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                checkedIn ? "bg-brand-green" : "bg-brand-red"
              }`}
            />
            <span className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-xs font-semibold text-purple-300">
              {initial}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-base-panel border border-base-border rounded-lg shadow-xl overflow-hidden z-20">
              <div className="px-4 py-2.5 border-b border-base-border bg-base-sidebar/50">
                <p className="text-xs font-semibold text-ink-primary truncate">
                  {currentUser?.name || "User"}
                </p>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[10px] text-ink-secondary truncate">
                    {currentUser?.loginId || "WOADUS20260001"}
                  </p>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                      isAdmin
                        ? "bg-purple-600/20 text-purple-300"
                        : "bg-blue-600/20 text-blue-300"
                    }`}
                  >
                    {currentUser?.role || "Admin"}
                  </span>
                </div>
              </div>
              <button
                className="w-full text-left px-4 py-2 text-xs text-ink-primary hover:bg-base-sidebar transition-colors"
                onClick={() => {
                  setMenuOpen(false)
                  onNavigate("employees")
                }}
              >
                Directory
              </button>
              <button
                className="w-full text-left px-4 py-2 text-xs text-purple-400 hover:bg-base-sidebar transition-colors border-t border-base-border font-medium flex items-center justify-between"
                onClick={() => {
                  setMenuOpen(false)
                  onToggleRole()
                }}
              >
                <span>Switch to {isAdmin ? "Employee" : "Admin"}</span>
                <span>⇄</span>
              </button>
              <button
                className="w-full text-left px-4 py-2 text-xs text-brand-red hover:bg-base-sidebar transition-colors border-t border-base-border font-medium"
                onClick={() => {
                  setMenuOpen(false)
                  if (onLogout) onLogout()
                }}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
