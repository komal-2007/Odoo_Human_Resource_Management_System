// Mock attendance data for the Admin/HR Attendance page.
//
// Shape, designed to be easy to swap for a real API later:
//
//   attendanceByDate["2026-08-22"][employeeId] = {
//     status: "present" | "on-leave" | "absent" | "not-clocked-in",
//     checkIn: "09:02 AM" | null,
//     checkOut: "05:32 PM" | null,
//     workHours: "8h 30m" | null,
//     extraHours: "30m" | null,
//   }
//
// When Person 1's API is ready, `getAttendanceForDate(dateKey)` below is
// the only function that needs to change — it can call the API instead
// of reading from this object, and everything that imports it (the
// Attendance page) keeps working unchanged.

export const attendanceByDate = {
  "2026-08-22": {
    1: { status: "present", checkIn: "09:02 AM", checkOut: "05:32 PM", workHours: "8h 30m", extraHours: "30m" },
    2: { status: "on-leave", checkIn: null, checkOut: null, workHours: null, extraHours: null },
    3: { status: "not-clocked-in", checkIn: null, checkOut: null, workHours: null, extraHours: null },
    4: { status: "present", checkIn: "08:55 AM", checkOut: "06:10 PM", workHours: "9h 15m", extraHours: "1h 15m" },
    5: { status: "absent", checkIn: null, checkOut: null, workHours: null, extraHours: null },
    6: { status: "present", checkIn: "09:20 AM", checkOut: null, workHours: null, extraHours: null },
    7: { status: "on-leave", checkIn: null, checkOut: null, workHours: null, extraHours: null },
    8: { status: "present", checkIn: "09:05 AM", checkOut: "05:45 PM", workHours: "8h 40m", extraHours: "40m" },
    9: { status: "not-clocked-in", checkIn: null, checkOut: null, workHours: null, extraHours: null },
  },
  "2026-08-21": {
    1: { status: "present", checkIn: "09:10 AM", checkOut: "05:40 PM", workHours: "8h 30m", extraHours: "30m" },
    2: { status: "present", checkIn: "09:15 AM", checkOut: "05:05 PM", workHours: "7h 50m", extraHours: null },
    3: { status: "absent", checkIn: null, checkOut: null, workHours: null, extraHours: null },
    4: { status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM", workHours: "9h 00m", extraHours: "1h 00m" },
    5: { status: "on-leave", checkIn: null, checkOut: null, workHours: null, extraHours: null },
    6: { status: "present", checkIn: "09:25 AM", checkOut: "05:30 PM", workHours: "8h 05m", extraHours: null },
    7: { status: "present", checkIn: "09:05 AM", checkOut: "05:50 PM", workHours: "8h 45m", extraHours: "45m" },
    8: { status: "absent", checkIn: null, checkOut: null, workHours: null, extraHours: null },
    9: { status: "present", checkIn: "09:30 AM", checkOut: "05:15 PM", workHours: "7h 45m", extraHours: null },
  },
}

// Falls back to "not-clocked-in" for every employee if a date has no
// mock data yet — keeps the date navigator usable beyond the two
// seeded days without needing a full calendar of fake data.
export function getAttendanceForDate(dateKey, employeeIds) {
  const dayRecords = attendanceByDate[dateKey]

  const emptyRecord = {
    status: "not-clocked-in",
    checkIn: null,
    checkOut: null,
    workHours: null,
    extraHours: null,
  }

  const result = {}
  employeeIds.forEach((id) => {
    result[id] = (dayRecords && dayRecords[id]) || emptyRecord
  })
  return result
}
