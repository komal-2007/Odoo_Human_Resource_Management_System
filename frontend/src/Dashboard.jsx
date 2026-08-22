import { useState } from "react";
import "./App.css";

const initialEmployees = [
  {
    id: 1,
    name: "John Doe",
    role: "Software Developer",
    department: "Engineering",
    email: "john.doe@company.com",
    phone: "+91 98765 43210",
    status: "present",
  },
  {
    id: 2,
    name: "Sarah Smith",
    role: "UI/UX Designer",
    department: "Design",
    email: "sarah.smith@company.com",
    phone: "+91 98765 43211",
    status: "leave",
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Backend Developer",
    department: "Engineering",
    email: "michael.brown@company.com",
    phone: "+91 98765 43212",
    status: "absent",
  },
  {
    id: 4,
    name: "Emily Wilson",
    role: "HR Executive",
    department: "Human Resources",
    email: "emily.wilson@company.com",
    phone: "+91 98765 43213",
    status: "present",
  },
  {
    id: 5,
    name: "David Miller",
    role: "Project Manager",
    department: "Management",
    email: "david.miller@company.com",
    phone: "+91 98765 43214",
    status: "present",
  },
  {
    id: 6,
    name: "Olivia Davis",
    role: "QA Engineer",
    department: "Testing",
    email: "olivia.davis@company.com",
    phone: "+91 98765 43215",
    status: "leave",
  },
  {
    id: 7,
    name: "James Anderson",
    role: "Frontend Developer",
    department: "Engineering",
    email: "james.anderson@company.com",
    phone: "+91 98765 43216",
    status: "present",
  },
  {
    id: 8,
    name: "Sophia Taylor",
    role: "Data Analyst",
    department: "Analytics",
    email: "sophia.taylor@company.com",
    phone: "+91 98765 43217",
    status: "absent",
  },
  {
    id: 9,
    name: "Daniel Thomas",
    role: "System Administrator",
    department: "IT",
    email: "daniel.thomas@company.com",
    phone: "+91 98765 43218",
    status: "present",
  },
];

function Dashboard() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [activeTab, setActiveTab] = useState("Employees");
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckIn = () => {
    setEmployees((currentEmployees) =>
      currentEmployees.map((employee) =>
        employee.id === 1
          ? { ...employee, status: "present" }
          : employee
      )
    );
  };

  const handleCheckOut = () => {
    setEmployees((currentEmployees) =>
      currentEmployees.map((employee) =>
        employee.id === 1
          ? { ...employee, status: "absent" }
          : employee
      )
    );
  };

  const getStatusLabel = (status) => {
    if (status === "present") return "Present";
    if (status === "leave") return "On Leave";
    return "Absent";
  };

  return (
    <div className="app">

      {/* ================= TOP NAVIGATION ================= */}
      <header className="top-navbar">

        <div className="company-logo">
          <div className="logo-mark">C</div>
          <span>Company</span>
        </div>

        <nav className="navigation">
          <button
            className={activeTab === "Employees" ? "nav-link active" : "nav-link"}
            onClick={() => {
              setActiveTab("Employees");
              setSelectedEmployee(null);
            }}
          >
            Employees
          </button>

          <button
            className={activeTab === "Attendance" ? "nav-link active" : "nav-link"}
            onClick={() => {
              setActiveTab("Attendance");
              setSelectedEmployee(null);
            }}
          >
            Attendance
          </button>

          <button
            className={activeTab === "Time Off" ? "nav-link active" : "nav-link"}
            onClick={() => {
              setActiveTab("Time Off");
              setSelectedEmployee(null);
            }}
          >
            Time Off
          </button>
        </nav>

        <div className="profile-area">

          <button
            className="profile-avatar"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <span>M</span>
          </button>

          {profileOpen && (
            <div className="profile-dropdown">
              <button
                onClick={() => {
                  setProfileOpen(false);
                  setSelectedEmployee("profile");
                }}
              >
                My Profile
              </button>

              <button
                onClick={() => setProfileOpen(false)}
              >
                Log Out
              </button>
            </div>
          )}

        </div>
      </header>

      {/* ================= MAIN AREA ================= */}
      <main className="main-wrapper">

        {/* ================= EMPLOYEES PAGE ================= */}
        {activeTab === "Employees" && !selectedEmployee && (
          <>
            <div className="toolbar">

              <button className="new-button">
                NEW
              </button>

              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

            </div>

            <div className="employee-grid">

              {filteredEmployees.map((employee) => (
                <button
                  className="employee-card"
                  key={employee.id}
                  onClick={() => setSelectedEmployee(employee)}
                >

                  <div className="card-status">
                    <span className={`status-dot ${employee.status}`}></span>
                  </div>

                  <div className="employee-image">
                    <div className="person-icon">
                      <div className="person-head"></div>
                      <div className="person-body"></div>
                    </div>
                  </div>

                  <div className="employee-name">
                    {employee.name}
                  </div>

                </button>
              ))}

            </div>

            <div className="settings-text">
              Settings
            </div>
          </>
        )}

        {/* ================= EMPLOYEE DETAILS ================= */}
        {activeTab === "Employees" &&
          selectedEmployee &&
          selectedEmployee !== "profile" && (

          <div className="details-page">

            <button
              className="back-button"
              onClick={() => setSelectedEmployee(null)}
            >
              ← Back to Employees
            </button>

            <div className="details-card">

              <div className="details-avatar">
                <div className="person-icon large">
                  <div className="person-head"></div>
                  <div className="person-body"></div>
                </div>
              </div>

              <div className="details-content">

                <div className="details-title">
                  <div>
                    <h1>{selectedEmployee.name}</h1>
                    <p>{selectedEmployee.role}</p>
                  </div>

                  <span className={`detail-status ${selectedEmployee.status}`}>
                    <span className={`status-dot ${selectedEmployee.status}`}></span>
                    {getStatusLabel(selectedEmployee.status)}
                  </span>
                </div>

                <div className="information-grid">

                  <div>
                    <label>Employee ID</label>
                    <p>EMP-{String(selectedEmployee.id).padStart(3, "0")}</p>
                  </div>

                  <div>
                    <label>Department</label>
                    <p>{selectedEmployee.department}</p>
                  </div>

                  <div>
                    <label>Email</label>
                    <p>{selectedEmployee.email}</p>
                  </div>

                  <div>
                    <label>Phone</label>
                    <p>{selectedEmployee.phone}</p>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================= MY PROFILE ================= */}
        {selectedEmployee === "profile" && (
          <div className="details-page">

            <button
              className="back-button"
              onClick={() => setSelectedEmployee(null)}
            >
              ← Back
            </button>

            <div className="details-card">

              <div className="details-avatar">
                <div className="profile-big-avatar">
                  M
                </div>
              </div>

              <div className="details-content">

                <div className="details-title">
                  <div>
                    <h1>My Profile</h1>
                    <p>Employee</p>
                  </div>
                </div>

                <div className="information-grid">

                  <div>
                    <label>Name</label>
                    <p>Employee Name</p>
                  </div>

                  <div>
                    <label>Employee ID</label>
                    <p>EMP-001</p>
                  </div>

                  <div>
                    <label>Email</label>
                    <p>employee@company.com</p>
                  </div>

                  <div>
                    <label>Department</label>
                    <p>Engineering</p>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================= ATTENDANCE ================= */}
        {activeTab === "Attendance" && (
          <div className="attendance-page">

            <div className="page-heading">
              <h1>Attendance</h1>
              <p>Manage your daily attendance.</p>
            </div>

            <div className="attendance-actions">

              <div className="attendance-box">
                <span className="attendance-label">
                  Check IN
                </span>

                <button
                  className="check-button"
                  onClick={handleCheckIn}
                >
                  Check IN →
                </button>
              </div>

              <div className="attendance-box">
                <span className="since-text">
                  Since 09:00 AM
                </span>

                <button
                  className="check-button"
                  onClick={handleCheckOut}
                >
                  Check Out →
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ================= TIME OFF ================= */}
        {activeTab === "Time Off" && (
          <div className="timeoff-page">

            <div className="page-heading">
              <h1>Time Off</h1>
              <p>View your leave and time-off information.</p>
            </div>

            <div className="timeoff-card">
              <div>
                <span>Available Time Off</span>
                <strong>12 Days</strong>
              </div>

              <button className="new-button">
                NEW
              </button>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}

export default Dashboard;