import { useState } from "react"
import Navbar from "./components/Navbar"
import Employees from "./pages/Employees"
import EmployeeProfile from "./pages/EmployeeProfile"
import Attendance from "./pages/Attendance"
import TimeOff from "./pages/TimeOff"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import { getCurrentUser, logoutUser } from "./services/authService"

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())
  const [authMode, setAuthMode] = useState("signin") // "signin" | "signup"
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

  function handleAuthSuccess(user) {
    setCurrentUser(user)
    setPage("employees")
  }

  function handleLogout() {
    logoutUser()
    setCurrentUser(null)
    setAuthMode("signin")
  }

  function handleToggleRole() {
    if (!currentUser) return
    const newRole = currentUser.role === "admin" ? "employee" : "admin"
    const updatedUser = { ...currentUser, role: newRole }
    setCurrentUser(updatedUser)
    localStorage.setItem("dayflow_user", JSON.stringify(updatedUser))
  }

  // If user is not logged in, show the Auth screens (Sign In or Sign Up)
  if (!currentUser) {
    if (authMode === "signup") {
      return (
        <SignUp
          onSignUpSuccess={handleAuthSuccess}
          onNavigateToSignIn={() => setAuthMode("signin")}
        />
      )
    }
    return (
      <SignIn
        onSignInSuccess={handleAuthSuccess}
        onNavigateToSignUp={() => setAuthMode("signup")}
      />
    )
  }

  return (
    <div className="min-h-screen bg-base-bg text-ink-primary font-body">
      <Navbar
        currentPage={page}
        onNavigate={handleNavigate}
        checkedIn={checkedIn}
        currentUser={currentUser}
        onLogout={handleLogout}
        onToggleRole={handleToggleRole}
      />
      <main>
        {page === "employees" &&
          (selectedEmployeeId ? (
            <EmployeeProfile
              employeeId={selectedEmployeeId}
              onBack={() => setSelectedEmployeeId(null)}
              currentUser={currentUser}
            />
          ) : (
            <Employees
              onSelectEmployee={setSelectedEmployeeId}
              currentUser={currentUser}
            />
          ))}

        {page === "attendance" && (
          <Attendance
            checkedIn={checkedIn}
            since={since}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            currentUser={currentUser}
          />
        )}

        {page === "timeoff" && <TimeOff currentUser={currentUser} />}
      </main>
    </div>
  )
}
