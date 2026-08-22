import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const employeesData = [
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
    status: "present",
  },
  {
    id: 4,
    name: "Emily Wilson",
    role: "HR Executive",
    department: "Human Resources",
    email: "emily.wilson@company.com",
    phone: "+91 98765 43213",
    status: "absent",
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

const attendanceData = [
  {
    date: "28/10/2025",
    employee: "John Doe",
    checkIn: "10:00",
    checkOut: "19:00",
    workHours: "09:00",
    extraHours: "01:00",
  },
  {
    date: "29/10/2025",
    employee: "John Doe",
    checkIn: "10:00",
    checkOut: "19:00",
    workHours: "09:00",
    extraHours: "01:00",
  },
  {
    date: "30/10/2025",
    employee: "John Doe",
    checkIn: "10:15",
    checkOut: "19:00",
    workHours: "08:45",
    extraHours: "00:45",
  },
];

function Dashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Employees");
  const [search, setSearch] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [profileOpen, setProfileOpen] = useState(false);

  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);

  const [userRole, setUserRole] = useState("admin");

  const filteredEmployees = employeesData.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ===============================
     CHECK IN
  ================================ */

  const handleCheckIn = () => {
    const now = new Date();

    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setCheckedIn(true);
    setCheckInTime(time);
  };

  /* ===============================
     CHECK OUT
  ================================ */

  const handleCheckOut = () => {
    setCheckedIn(false);
  };

  /* ===============================
     LOGOUT
  ================================ */

  const handleLogout = () => {
    setProfileOpen(false);
    navigate("/login");
  };

  /* ===============================
     OPEN MY PROFILE
  ================================ */

  const handleMyProfile = () => {
    setProfileOpen(false);

    setSelectedEmployee({
      id: 0,
      name: "My Profile",
      role: "Employee",
      department: "General",
      email: "employee@company.com",
      phone: "+91 XXXXX XXXXX",
    });

    setActiveTab("Employees");
  };

  return (
    <div className="dashboard">

      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}

      <header className="top-navbar">

        {/* COMPANY LOGO */}

        <div className="company-logo">

          <div className="logo-box">
            D
          </div>

          <span>
            Dayflow
          </span>

        </div>


        {/* NAVIGATION */}

        <nav className="navigation">

          <button
            className={
              activeTab === "Employees"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() => {
              setActiveTab("Employees");
              setSelectedEmployee(null);
            }}
          >
            Employees
          </button>


          <button
            className={
              activeTab === "Attendance"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() => {
              setActiveTab("Attendance");
              setSelectedEmployee(null);
            }}
          >
            Attendance
          </button>


          <button
            className={
              activeTab === "Time Off"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() => {
              setActiveTab("Time Off");
              setSelectedEmployee(null);
            }}
          >
            Time Off
          </button>

        </nav>


        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <div className="navbar-right">

          {/* CHECK-IN STATUS */}

          <div className="top-check-status">

            <span
              className={
                checkedIn
                  ? "top-status-dot online"
                  : "top-status-dot offline"
              }
            ></span>

            <span>
              {checkedIn
                ? "Checked In"
                : "Not Checked In"}
            </span>

          </div>


          {/* PROFILE */}

          <div className="profile-container">

            <button
              className="profile-avatar"
              onClick={() =>
                setProfileOpen(!profileOpen)
              }
            >
              M
            </button>


            {profileOpen && (

              <div className="profile-dropdown">

                <button
                  onClick={handleMyProfile}
                >
                  My Profile
                </button>


                <button
                  onClick={handleLogout}
                >
                  Log Out
                </button>

              </div>

            )}

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="main-content">


        {/* =====================================================
            EMPLOYEES PAGE
        ===================================================== */}

        {activeTab === "Employees" &&
          !selectedEmployee && (

            <section className="employees-section">

              {/* HEADER */}

              <div className="page-header">

                <button className="new-button">
                  NEW
                </button>


                <div className="search-container">

                  <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />

                </div>

              </div>


              {/* EMPLOYEE CARDS */}

              <div className="employee-grid">

                {filteredEmployees.map(
                  (employee) => (

                    <div
                      className="employee-card"
                      key={employee.id}
                      onClick={() =>
                        setSelectedEmployee(
                          employee
                        )
                      }
                    >

                      <div className="employee-top">

                        <div className="employee-photo">
                          👤
                        </div>


                        <span
                          className={`status-dot ${employee.status}`}
                        ></span>

                      </div>


                      <div className="employee-name">
                        {employee.name}
                      </div>


                      <div className="employee-role">
                        {employee.role}
                      </div>


                      <div className="employee-department">
                        {employee.department}
                      </div>

                    </div>

                  )
                )}

              </div>

            </section>

          )}


        {/* =====================================================
            EMPLOYEE INFORMATION / MY PROFILE
        ===================================================== */}

        {activeTab === "Employees" &&
          selectedEmployee && (

            <section className="employee-details-page">

              <button
                className="back-button"
                onClick={() =>
                  setSelectedEmployee(null)
                }
              >
                ← Back
              </button>


              <div className="employee-details-card">

                <div className="details-profile">

                  <div className="large-profile">
                    👤
                  </div>


                  <div>

                    <h2>
                      {selectedEmployee.name}
                    </h2>

                    <p>
                      {selectedEmployee.role}
                    </p>

                  </div>

                </div>


                <div className="details-divider"></div>


                <div className="details-grid">

                  <div>

                    <label>
                      Department
                    </label>

                    <p>
                      {selectedEmployee.department}
                    </p>

                  </div>


                  <div>

                    <label>
                      Email
                    </label>

                    <p>
                      {selectedEmployee.email}
                    </p>

                  </div>


                  <div>

                    <label>
                      Phone
                    </label>

                    <p>
                      {selectedEmployee.phone}
                    </p>

                  </div>


                  <div>

                    <label>
                      Employee ID
                    </label>

                    <p>
                      EMP-
                      {String(
                        selectedEmployee.id || 1
                      ).padStart(3, "0")}
                    </p>

                  </div>

                </div>


                {/* VIEW ONLY */}

                <div className="view-only-label">
                  View Only
                </div>

              </div>

            </section>

          )}


        {/* =====================================================
            ATTENDANCE PAGE
        ===================================================== */}

        {activeTab === "Attendance" && (

          <section className="attendance-section">

            {/* HEADER */}

            <div className="attendance-header">

              <h2>
                Attendance
              </h2>


              <div className="attendance-search">

                <input
                  type="text"
                  placeholder="Searchbar"
                />

              </div>

            </div>


            {/* TOOLBAR */}

            <div className="attendance-toolbar">

              <button>
                ←
              </button>

              <button>
                →
              </button>

              <button className="date-button">
                Date ▾
              </button>

              <button className="day-button">
                Day
              </button>

            </div>


            {/* ROLE SWITCH */}

            <div className="role-switch">

              <span>

                Viewing as:

                <strong>
                  {userRole === "admin"
                    ? " Admin / HR Officer"
                    : " Employee"}
                </strong>

              </span>


              <button
                onClick={() =>
                  setUserRole(
                    userRole === "admin"
                      ? "employee"
                      : "admin"
                  )
                }
              >
                Switch View
              </button>

            </div>


            {/* =================================================
                ADMIN / HR VIEW
            ================================================= */}

            {userRole === "admin" && (

              <div className="attendance-table-wrapper">

                <table className="attendance-table">

                  <thead>

                    <tr>

                      <th>
                        Employee
                      </th>

                      <th>
                        Check In
                      </th>

                      <th>
                        Check Out
                      </th>

                      <th>
                        Work Hours
                      </th>

                      <th>
                        Extra Hours
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {attendanceData.map(
                      (record, index) => (

                        <tr key={index}>

                          <td>
                            {record.employee}
                          </td>

                          <td>
                            {record.checkIn}
                          </td>

                          <td>
                            {record.checkOut}
                          </td>

                          <td>
                            {record.workHours}
                          </td>

                          <td>
                            {record.extraHours}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}


            {/* =================================================
                EMPLOYEE VIEW
            ================================================= */}

            {userRole === "employee" && (

              <div className="employee-attendance">

                <div className="attendance-summary">

                  <div>

                    <span>
                      Count of days present
                    </span>

                    <strong>
                      22
                    </strong>

                  </div>


                  <div>

                    <span>
                      Leaves count
                    </span>

                    <strong>
                      2
                    </strong>

                  </div>


                  <div>

                    <span>
                      Total working days
                    </span>

                    <strong>
                      24
                    </strong>

                  </div>

                </div>


                <div className="attendance-table-wrapper">

                  <table className="attendance-table">

                    <thead>

                      <tr>

                        <th>
                          Date
                        </th>

                        <th>
                          Check In
                        </th>

                        <th>
                          Check Out
                        </th>

                        <th>
                          Work Hours
                        </th>

                        <th>
                          Extra Hours
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {attendanceData.map(
                        (record, index) => (

                          <tr key={index}>

                            <td>
                              {record.date}
                            </td>

                            <td>
                              {record.checkIn}
                            </td>

                            <td>
                              {record.checkOut}
                            </td>

                            <td>
                              {record.workHours}
                            </td>

                            <td>
                              {record.extraHours}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            )}

          </section>

        )}


        {/* =====================================================
            TIME OFF
        ===================================================== */}

        {activeTab === "Time Off" && (

          <section className="timeoff-section">

            <div className="timeoff-header">

              <button className="new-button">
                NEW
              </button>


              <input
                type="text"
                placeholder="Searchbar"
              />

            </div>


            <div className="leave-summary">

              <div>

                <span>
                  Paid Time Off
                </span>

                <strong>
                  24 Days Available
                </strong>

              </div>


              <div>

                <span>
                  Sick Time Off
                </span>

                <strong>
                  07 Days Available
                </strong>

              </div>

            </div>


            <div className="timeoff-table-wrapper">

              <table className="timeoff-table">

                <thead>

                  <tr>

                    <th>
                      Name
                    </th>

                    <th>
                      Start Date
                    </th>

                    <th>
                      End Date
                    </th>

                    <th>
                      Time Off Type
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  <tr>

                    <td>
                      Sarah Smith
                    </td>

                    <td>
                      28/10/2025
                    </td>

                    <td>
                      28/10/2025
                    </td>

                    <td>
                      Paid Time Off
                    </td>

                    <td>

                      <span className="pending">
                        Pending
                      </span>

                    </td>

                  </tr>


                  <tr>

                    <td>
                      Michael Brown
                    </td>

                    <td>
                      01/11/2025
                    </td>

                    <td>
                      03/11/2025
                    </td>

                    <td>
                      Sick Leave
                    </td>

                    <td>

                      <span className="pending">
                        Pending
                      </span>

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </section>

        )}

      </main>


      {/* =====================================================
          CHECK IN / CHECK OUT ACTION
      ===================================================== */}

      <div className="attendance-actions">

        {!checkedIn ? (

          <div className="check-card">

            <button
              className="check-in-button"
              onClick={handleCheckIn}
            >
              Check IN →
            </button>

          </div>

        ) : (

          <div className="check-card checked">

            <span>
              Since {checkInTime}
            </span>


            <button
              className="check-out-button"
              onClick={handleCheckOut}
            >
              Check Out →
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;