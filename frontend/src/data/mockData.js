// All mock data for the Admin app lives here.
// In a real app this would come from an API — for the hackathon
// we just hardcode it so the UI has something to render.

// Employee attendance/work status, used to pick the status indicator
// on each card in the Employees grid:
//   "present"        -> green dot   (in the office)
//   "on-leave"       -> plane icon  (approved time off)
//   "absent"         -> yellow dot  (no time off applied, but absent)
//   "not-clocked-in" -> empty ring  (hasn't checked in yet today)
//
// Each employee also carries the extra fields the Employee Profile
// page needs: header info, resume, private info, salary, and a small
// security block. Keeping it all in one object per employee keeps the
// profile page a simple lookup by id.

export const employees = [
  {
    id: 1,
    name: "Mohitha N",
    department: "Engineering",
    status: "present",
    loginId: "DF20250001",
    company: "Dayflow Technologies",
    manager: "Anita Rao",
    location: "Bengaluru, IN",
    resume: {
      about:
        "Frontend engineer with 4 years of experience building React applications, focused on performance and accessibility.",
      whatILoveAboutMyJob:
        "Solving tricky UI problems and seeing a feature go from sketch to something people use every day.",
      skills: ["React", "TypeScript", "Tailwind CSS", "Figma"],
      certifications: ["AWS Certified Cloud Practitioner"],
    },
    privateInfo: {
      personalEmail: "mohitha.n@personal.com",
      phone: "+91 98765 43210",
      address: "204, 4th Cross, Indiranagar, Bengaluru, KA 560038",
      dateOfBirth: "14 Mar 1996",
      maritalStatus: "Single",
    },
    salary: {
      monthWage: 50000,
      yearlyWage: 600000,
      workingDaysPerWeek: 5,
      breakTimeHrs: 1,
      components: [
        { label: "Basic Salary", amountPerMonth: 25000, percentOfWage: 50 },
        { label: "House Rent Allowance", amountPerMonth: 12500, percentOfWage: 25 },
        { label: "Standard Allowance", amountPerMonth: 4167, percentOfWage: 8.33 },
        { label: "Performance Bonus", amountPerMonth: 2083, percentOfWage: 4.17 },
        { label: "Leave Travel Allowance", amountPerMonth: 2083, percentOfWage: 4.17 },
        { label: "Fixed Allowance", amountPerMonth: 4167, percentOfWage: 8.33 },
      ],
      providentFund: {
        employeeContribution: 3000,
        employerContribution: 3000,
        percent: 12,
      },
      taxDeductions: [{ label: "Professional Tax", amountPerMonth: 200 }],
    },
    security: {
      lastPasswordChange: "12 Jun 2026",
      twoFactorEnabled: true,
    },
  },
  {
    id: 2,
    name: "Cultured Crab",
    department: "Design",
    status: "on-leave",
    loginId: "DF20250002",
    company: "Dayflow Technologies",
    manager: "Anita Rao",
    location: "Remote — Pune, IN",
    resume: {
      about:
        "Product designer specializing in design systems and interaction design for internal tools.",
      whatILoveAboutMyJob:
        "Turning messy workflows into interfaces that just make sense.",
      skills: ["Figma", "Design Systems", "Prototyping"],
      certifications: [],
    },
    privateInfo: {
      personalEmail: "cultured.crab@personal.com",
      phone: "+91 91234 56780",
      address: "12 Koregaon Park, Pune, MH 411001",
      dateOfBirth: "02 Nov 1994",
      maritalStatus: "Married",
    },
    salary: {
      monthWage: 62000,
      yearlyWage: 744000,
      workingDaysPerWeek: 5,
      breakTimeHrs: 1,
      components: [
        { label: "Basic Salary", amountPerMonth: 31000, percentOfWage: 50 },
        { label: "House Rent Allowance", amountPerMonth: 15500, percentOfWage: 25 },
        { label: "Standard Allowance", amountPerMonth: 5167, percentOfWage: 8.33 },
        { label: "Performance Bonus", amountPerMonth: 2583, percentOfWage: 4.17 },
        { label: "Leave Travel Allowance", amountPerMonth: 2583, percentOfWage: 4.17 },
        { label: "Fixed Allowance", amountPerMonth: 5167, percentOfWage: 8.33 },
      ],
      providentFund: {
        employeeContribution: 3720,
        employerContribution: 3720,
        percent: 12,
      },
      taxDeductions: [{ label: "Professional Tax", amountPerMonth: 200 }],
    },
    security: {
      lastPasswordChange: "03 Jan 2026",
      twoFactorEnabled: false,
    },
  },
  {
    id: 3,
    name: "Soulful Cormorant",
    department: "Marketing",
    status: "not-clocked-in",
    loginId: "DF20250003",
    company: "Dayflow Technologies",
    manager: "Ravi Menon",
    location: "Bengaluru, IN",
    resume: {
      about:
        "Marketing associate focused on content strategy and campaign performance tracking.",
      whatILoveAboutMyJob:
        "Watching a campaign idea turn into numbers we can actually learn from.",
      skills: ["Content Strategy", "SEO", "Analytics"],
      certifications: ["Google Analytics Certified"],
    },
    privateInfo: {
      personalEmail: "soulful.cormorant@personal.com",
      phone: "+91 99887 76655",
      address: "45 HSR Layout, Bengaluru, KA 560102",
      dateOfBirth: "27 Jul 1998",
      maritalStatus: "Single",
    },
    salary: {
      monthWage: 45000,
      yearlyWage: 540000,
      workingDaysPerWeek: 5,
      breakTimeHrs: 1,
      components: [
        { label: "Basic Salary", amountPerMonth: 22500, percentOfWage: 50 },
        { label: "House Rent Allowance", amountPerMonth: 11250, percentOfWage: 25 },
        { label: "Standard Allowance", amountPerMonth: 3750, percentOfWage: 8.33 },
        { label: "Performance Bonus", amountPerMonth: 1875, percentOfWage: 4.17 },
        { label: "Leave Travel Allowance", amountPerMonth: 1875, percentOfWage: 4.17 },
        { label: "Fixed Allowance", amountPerMonth: 3750, percentOfWage: 8.33 },
      ],
      providentFund: {
        employeeContribution: 2700,
        employerContribution: 2700,
        percent: 12,
      },
      taxDeductions: [{ label: "Professional Tax", amountPerMonth: 200 }],
    },
    security: {
      lastPasswordChange: "20 Aug 2026",
      twoFactorEnabled: false,
    },
  },
  {
    id: 4,
    name: "Charming Monkey",
    department: "Engineering",
    status: "present",
    loginId: "DF20250004",
    company: "Dayflow Technologies",
    manager: "Anita Rao",
    location: "Bengaluru, IN",
    resume: {
      about:
        "Backend engineer working on payroll and attendance services, with a focus on data correctness.",
      whatILoveAboutMyJob:
        "Untangling edge cases in payroll math until the numbers finally add up.",
      skills: ["Node.js", "PostgreSQL", "System Design"],
      certifications: [],
    },
    privateInfo: {
      personalEmail: "charming.monkey@personal.com",
      phone: "+91 90000 11223",
      address: "9 Whitefield, Bengaluru, KA 560066",
      dateOfBirth: "19 May 1993",
      maritalStatus: "Married",
    },
    salary: {
      monthWage: 70000,
      yearlyWage: 840000,
      workingDaysPerWeek: 5,
      breakTimeHrs: 1,
      components: [
        { label: "Basic Salary", amountPerMonth: 35000, percentOfWage: 50 },
        { label: "House Rent Allowance", amountPerMonth: 17500, percentOfWage: 25 },
        { label: "Standard Allowance", amountPerMonth: 5833, percentOfWage: 8.33 },
        { label: "Performance Bonus", amountPerMonth: 2917, percentOfWage: 4.17 },
        { label: "Leave Travel Allowance", amountPerMonth: 2917, percentOfWage: 4.17 },
        { label: "Fixed Allowance", amountPerMonth: 5833, percentOfWage: 8.33 },
      ],
      providentFund: {
        employeeContribution: 4200,
        employerContribution: 4200,
        percent: 12,
      },
      taxDeductions: [{ label: "Professional Tax", amountPerMonth: 200 }],
    },
    security: {
      lastPasswordChange: "28 Feb 2026",
      twoFactorEnabled: true,
    },
  },
  {
    id: 5,
    name: "Cuddly Rhinoceros",
    department: "Sales",
    status: "absent",
    loginId: "DF20250005",
    company: "Dayflow Technologies",
    manager: "Ravi Menon",
    location: "Mumbai, IN",
    resume: {
      about:
        "Sales executive handling mid-market accounts across Western India.",
      whatILoveAboutMyJob:
        "The moment a client goes from skeptical to signed.",
      skills: ["Negotiation", "CRM Tools", "Account Management"],
      certifications: [],
    },
    privateInfo: {
      personalEmail: "cuddly.rhinoceros@personal.com",
      phone: "+91 98111 22334",
      address: "78 Bandra West, Mumbai, MH 400050",
      dateOfBirth: "08 Sep 1990",
      maritalStatus: "Married",
    },
    salary: {
      monthWage: 55000,
      yearlyWage: 660000,
      workingDaysPerWeek: 5,
      breakTimeHrs: 1,
      components: [
        { label: "Basic Salary", amountPerMonth: 27500, percentOfWage: 50 },
        { label: "House Rent Allowance", amountPerMonth: 13750, percentOfWage: 25 },
        { label: "Standard Allowance", amountPerMonth: 4583, percentOfWage: 8.33 },
        { label: "Performance Bonus", amountPerMonth: 2292, percentOfWage: 4.17 },
        { label: "Leave Travel Allowance", amountPerMonth: 2292, percentOfWage: 4.17 },
        { label: "Fixed Allowance", amountPerMonth: 4583, percentOfWage: 8.33 },
      ],
      providentFund: {
        employeeContribution: 3300,
        employerContribution: 3300,
        percent: 12,
      },
      taxDeductions: [{ label: "Professional Tax", amountPerMonth: 200 }],
    },
    security: {
      lastPasswordChange: "15 Apr 2026",
      twoFactorEnabled: false,
    },
  },
  {
    id: 6,
    name: "Playful Otter",
    department: "Engineering",
    status: "present",
    loginId: "DF20250006",
    company: "Dayflow Technologies",
    manager: "Anita Rao",
    location: "Bengaluru, IN",
    resume: {
      about:
        "Full-stack engineer contributing to the attendance and time-off modules.",
      whatILoveAboutMyJob:
        "Shipping something small on Monday and seeing people actually use it by Friday.",
      skills: ["React", "Node.js", "Docker"],
      certifications: [],
    },
    privateInfo: {
      personalEmail: "playful.otter@personal.com",
      phone: "+91 97766 55443",
      address: "33 JP Nagar, Bengaluru, KA 560078",
      dateOfBirth: "30 Jan 1997",
      maritalStatus: "Single",
    },
    salary: {
      monthWage: 58000,
      yearlyWage: 696000,
      workingDaysPerWeek: 5,
      breakTimeHrs: 1,
      components: [
        { label: "Basic Salary", amountPerMonth: 29000, percentOfWage: 50 },
        { label: "House Rent Allowance", amountPerMonth: 14500, percentOfWage: 25 },
        { label: "Standard Allowance", amountPerMonth: 4833, percentOfWage: 8.33 },
        { label: "Performance Bonus", amountPerMonth: 2417, percentOfWage: 4.17 },
        { label: "Leave Travel Allowance", amountPerMonth: 2417, percentOfWage: 4.17 },
        { label: "Fixed Allowance", amountPerMonth: 4833, percentOfWage: 8.33 },
      ],
      providentFund: {
        employeeContribution: 3480,
        employerContribution: 3480,
        percent: 12,
      },
      taxDeductions: [{ label: "Professional Tax", amountPerMonth: 200 }],
    },
    security: {
      lastPasswordChange: "09 Jul 2026",
      twoFactorEnabled: true,
    },
  },
  {
    id: 7,
    name: "Wandering Falcon",
    department: "HR",
    status: "on-leave",
    loginId: "DF20250007",
    company: "Dayflow Technologies",
    manager: "Divya Iyer",
    location: "Bengaluru, IN",
    resume: {
      about:
        "HR generalist handling onboarding, leave policy, and employee records.",
      whatILoveAboutMyJob:
        "Being the first friendly face a new hire sees on day one.",
      skills: ["Onboarding", "HRMS Administration", "Policy Design"],
      certifications: ["SHRM-CP"],
    },
    privateInfo: {
      personalEmail: "wandering.falcon@personal.com",
      phone: "+91 96655 44332",
      address: "17 Malleshwaram, Bengaluru, KA 560003",
      dateOfBirth: "11 Dec 1995",
      maritalStatus: "Single",
    },
    salary: {
      monthWage: 52000,
      yearlyWage: 624000,
      workingDaysPerWeek: 5,
      breakTimeHrs: 1,
      components: [
        { label: "Basic Salary", amountPerMonth: 26000, percentOfWage: 50 },
        { label: "House Rent Allowance", amountPerMonth: 13000, percentOfWage: 25 },
        { label: "Standard Allowance", amountPerMonth: 4333, percentOfWage: 8.33 },
        { label: "Performance Bonus", amountPerMonth: 2167, percentOfWage: 4.17 },
        { label: "Leave Travel Allowance", amountPerMonth: 2167, percentOfWage: 4.17 },
        { label: "Fixed Allowance", amountPerMonth: 4333, percentOfWage: 8.33 },
      ],
      providentFund: {
        employeeContribution: 3120,
        employerContribution: 3120,
        percent: 12,
      },
      taxDeductions: [{ label: "Professional Tax", amountPerMonth: 200 }],
    },
    security: {
      lastPasswordChange: "22 May 2026",
      twoFactorEnabled: true,
    },
  },
  {
    id: 8,
    name: "Gentle Panther",
    department: "Design",
    status: "present",
    loginId: "DF20250008",
    company: "Dayflow Technologies",
    manager: "Anita Rao",
    location: "Bengaluru, IN",
    resume: {
      about:
        "Visual designer working on marketing collateral and product illustrations.",
      whatILoveAboutMyJob:
        "The stretch between a rough sketch and a final polished asset.",
      skills: ["Illustration", "Branding", "Adobe Creative Suite"],
      certifications: [],
    },
    privateInfo: {
      personalEmail: "gentle.panther@personal.com",
      phone: "+91 95544 33221",
      address: "5 Jayanagar, Bengaluru, KA 560011",
      dateOfBirth: "23 Jun 1999",
      maritalStatus: "Single",
    },
    salary: {
      monthWage: 48000,
      yearlyWage: 576000,
      workingDaysPerWeek: 5,
      breakTimeHrs: 1,
      components: [
        { label: "Basic Salary", amountPerMonth: 24000, percentOfWage: 50 },
        { label: "House Rent Allowance", amountPerMonth: 12000, percentOfWage: 25 },
        { label: "Standard Allowance", amountPerMonth: 4000, percentOfWage: 8.33 },
        { label: "Performance Bonus", amountPerMonth: 2000, percentOfWage: 4.17 },
        { label: "Leave Travel Allowance", amountPerMonth: 2000, percentOfWage: 4.17 },
        { label: "Fixed Allowance", amountPerMonth: 4000, percentOfWage: 8.33 },
      ],
      providentFund: {
        employeeContribution: 2880,
        employerContribution: 2880,
        percent: 12,
      },
      taxDeductions: [{ label: "Professional Tax", amountPerMonth: 200 }],
    },
    security: {
      lastPasswordChange: "17 Mar 2026",
      twoFactorEnabled: false,
    },
  },
  {
    id: 9,
    name: "Bright Sparrow",
    department: "Marketing",
    status: "not-clocked-in",
    loginId: "DF20250009",
    company: "Dayflow Technologies",
    manager: "Ravi Menon",
    location: "Remote — Hyderabad, IN",
    resume: {
      about:
        "Social media and community manager for the Dayflow brand.",
      whatILoveAboutMyJob:
        "Reading replies from people who actually got value out of a post.",
      skills: ["Social Media", "Copywriting", "Community Management"],
      certifications: [],
    },
    privateInfo: {
      personalEmail: "bright.sparrow@personal.com",
      phone: "+91 94433 22110",
      address: "22 Banjara Hills, Hyderabad, TG 500034",
      dateOfBirth: "05 Oct 2000",
      maritalStatus: "Single",
    },
    salary: {
      monthWage: 40000,
      yearlyWage: 480000,
      workingDaysPerWeek: 5,
      breakTimeHrs: 1,
      components: [
        { label: "Basic Salary", amountPerMonth: 20000, percentOfWage: 50 },
        { label: "House Rent Allowance", amountPerMonth: 10000, percentOfWage: 25 },
        { label: "Standard Allowance", amountPerMonth: 3333, percentOfWage: 8.33 },
        { label: "Performance Bonus", amountPerMonth: 1667, percentOfWage: 4.17 },
        { label: "Leave Travel Allowance", amountPerMonth: 1667, percentOfWage: 4.17 },
        { label: "Fixed Allowance", amountPerMonth: 3333, percentOfWage: 8.33 },
      ],
      providentFund: {
        employeeContribution: 2400,
        employerContribution: 2400,
        percent: 12,
      },
      taxDeductions: [{ label: "Professional Tax", amountPerMonth: 200 }],
    },
    security: {
      lastPasswordChange: "30 Jul 2026",
      twoFactorEnabled: false,
    },
  },
]
