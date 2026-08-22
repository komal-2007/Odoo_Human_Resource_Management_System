/**
 * Generates an Employee/Admin Login ID following the Excalidraw specification:
 * Format: [CompanyPrefix (2-3 chars)] + [First 2 letters of First & Last name] + [Year] + [4-digit Serial]
 *
 * Example:
 * Company: "Workly", Name: "John Doe", Year: 2026, Serial: 1
 * Output: "WOJODO20260001"
 */
export function generateLoginId(companyName = "Workly", fullName = "Admin User", year = new Date().getFullYear(), serialNumber = 1) {
  // 1. Company Prefix: Take first 2 alphanumeric letters in uppercase (e.g., Workly -> WO)
  const cleanCompany = (companyName || "WO").trim().replace(/[^a-zA-Z]/g, "").toUpperCase()
  const companyPrefix = cleanCompany.length >= 2 ? cleanCompany.slice(0, 2) : "WO"

  // 2. Name Letters: First 2 letters of first name + First 2 letters of last name
  const nameParts = (fullName || "Admin User").trim().split(/\s+/).filter(Boolean)
  let nameCode = "ADUS"

  if (nameParts.length >= 2) {
    const firstName = nameParts[0].replace(/[^a-zA-Z]/g, "").toUpperCase()
    const lastName = nameParts[nameParts.length - 1].replace(/[^a-zA-Z]/g, "").toUpperCase()
    
    const f2 = firstName.length >= 2 ? firstName.slice(0, 2) : (firstName + "X").slice(0, 2)
    const l2 = lastName.length >= 2 ? lastName.slice(0, 2) : (lastName + "X").slice(0, 2)
    nameCode = f2 + l2
  } else if (nameParts.length === 1) {
    const single = nameParts[0].replace(/[^a-zA-Z]/g, "").toUpperCase()
    nameCode = (single + "XXXX").slice(0, 4)
  }

  // 3. Year
  const yearCode = String(year || new Date().getFullYear())

  // 4. 4-digit serial number (e.g. 1 -> 0001)
  const serialCode = String(serialNumber || 1).padStart(4, "0")

  return `${companyPrefix}${nameCode}${yearCode}${serialCode}`
}
