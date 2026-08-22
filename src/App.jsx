import { useState } from "react"
import Navbar from "./components/Navbar"
import Employees from "./pages/Employees"
import EmployeeProfile from "./pages/EmployeeProfile"
import Attendance from "./pages/Attendance"
import TimeOff from "./pages/TimeOff"

// Three screens exist so far: the Employees grid (landing page), the
// Employee Profile page it opens into, and the Attendance page.
// `page` tracks which top-level nav section is open; within
// "employees", `selectedEmployeeId` further tracks whether the grid
// or a specific profile is shown. Time Off comes next, screen by
// screen. Once there are more pages, this is where routing (e.g.
// react-router) would take over from this simple state switch.
//
// Check-in/out status lives here (not in Attendance.jsx) so the
// Navbar's status dot can reflect it too. Swapping this for a real
// check-in API later just means replacing what handleCheckIn /
// handleCheckOut do — no other component needs to change.
export default function App() {
  const [page, setPage] = useState("employees")
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)
  const [checkedIn, setCheckedIn] = useState(false)
  const [since, setSince] = useState(null)

  function handleNavigate(nextPage) {
    setPage(nextPage)
    if (nextPage === "employees") {
      setSelectedEmployeeId(null)
    }
  }

  function handleCheckIn() {
    setCheckedIn(true)
    setSince(
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    )
  }

  function handleCheckOut() {
    setCheckedIn(false)
    setSince(null)
  }

  return (
    <div className="min-h-screen bg-base-bg text-ink-primary font-body">
      <Navbar
        currentPage={page}
        onNavigate={handleNavigate}
        checkedIn={checkedIn}
      />
      <main>
        {page === "employees" &&
          (selectedEmployeeId ? (
            <EmployeeProfile
              employeeId={selectedEmployeeId}
              onBack={() => setSelectedEmployeeId(null)}
            />
          ) : (
            <Employees onSelectEmployee={setSelectedEmployeeId} />
          ))}

        {page === "attendance" && (
          <Attendance
            checkedIn={checkedIn}
            since={since}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        )}

        {page === "timeoff" && <TimeOff />}
      </main>
    </div>
  )
}
