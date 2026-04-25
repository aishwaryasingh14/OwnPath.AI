export const DEMO_PARTICIPANTS = [
  // === ACTIVE RISK ===
  {
    id: "P001", firstName: "Rosa", lastName: "M.",
    currentWeek: 3, currentDay: 2,
    missedDays: 1, lateDays: 2,
    reportedBarriers: ["transportation"],
    consecutiveBarrierDays: 2,
    supportPreference: "resources",
    checkedInToday: true,
    checkinHistory: ["great","great","okay","worried","worried"],
    story: "Bus route changed. Missing Route 8 by 10 minutes."
  },
  {
    id: "P002", firstName: "Marcus", lastName: "T.",
    currentWeek: 3, currentDay: 3,
    missedDays: 2, lateDays: 1,
    reportedBarriers: ["housing", "overwhelmed"],
    consecutiveBarrierDays: 3,
    supportPreference: "staff_contact",
    checkedInToday: true,
    checkinHistory: ["great","okay","worried","struggling","struggling"],
    story: "Temporary housing situation became uncertain this week."
  },
  {
    id: "P003", firstName: "Diana", lastName: "R.",
    currentWeek: 6, currentDay: 1,
    missedDays: 1, lateDays: 0,
    reportedBarriers: ["childcare"],
    consecutiveBarrierDays: 1,
    supportPreference: "resources",
    checkedInToday: true,
    checkinHistory: ["great","great","great","great","okay","worried"],
    story: "Regular childcare provider unavailable this week."
  },

  // === DOING WELL ===
  {
    id: "P004", firstName: "James", lastName: "W.",
    currentWeek: 4, currentDay: 3,
    missedDays: 0, lateDays: 1,
    reportedBarriers: [],
    supportPreference: "none",
    checkedInToday: true,
    checkinHistory: ["great","great","great","great","great","great","great"],
    story: "Consistent attendance. ServSafe certified already."
  },
  {
    id: "P005", firstName: "Yolanda", lastName: "C.",
    currentWeek: 2, currentDay: 4,
    missedDays: 0, lateDays: 0,
    reportedBarriers: [],
    supportPreference: "reminder",
    checkedInToday: true,
    checkinHistory: ["okay","okay","great","great","great","great","great","great","great"],
    story: "Started nervous, building confidence quickly."
  },
  {
    id: "P006", firstName: "Tony", lastName: "B.",
    currentWeek: 7, currentDay: 2,
    missedDays: 0, lateDays: 2,
    reportedBarriers: [],
    supportPreference: "none",
    checkedInToday: true,
    checkinHistory: ["great","great","great","great","great","great"],
    story: "Already has a job offer pending program completion."
  },
  {
    id: "P007", firstName: "Leticia", lastName: "G.",
    currentWeek: 5, currentDay: 1,
    missedDays: 0, lateDays: 0,
    reportedBarriers: [],
    supportPreference: "none",
    checkedInToday: true,
    checkinHistory: ["great","great","great","great","great"],
    story: "Perfect attendance. Peer mentor to newer participants."
  },
  {
    id: "P008", firstName: "Andre", lastName: "K.",
    currentWeek: 1, currentDay: 3,
    missedDays: 0, lateDays: 0,
    reportedBarriers: ["overwhelmed"],
    supportPreference: "peer",
    checkedInToday: true,
    checkinHistory: ["okay","okay","worried"],
    story: "New to the program. Normal first-week jitters."
  },

  // === RECOVERY STORIES ===
  {
    id: "P009", firstName: "Maria", lastName: "S.",
    currentWeek: 8, currentDay: 3,
    missedDays: 1, lateDays: 1,
    reportedBarriers: [],
    supportPreference: "none",
    checkedInToday: true,
    checkinHistory: ["great","great","worried","struggling","worried","okay","okay","great","great","great"],
    story: "Had transport issues in week 3. Staff offered make-up slot. Recovered. Now thriving.",
    recoveryNote: "Offered make-up session in week 3. Completed successfully."
  },
  {
    id: "P010", firstName: "Carlos", lastName: "V.",
    currentWeek: 9, currentDay: 1,
    missedDays: 2, lateDays: 1,
    reportedBarriers: [],
    supportPreference: "none",
    checkedInToday: true,
    checkinHistory: ["okay","worried","struggling","struggling","okay","great","great","great","great","great"],
    story: "Housing crisis in week 2. 211 Arizona referral helped. Completed week 2.",
    recoveryNote: "Peer buddy outreach + 211 housing referral in week 2. On track to graduate."
  },
  {
    id: "P011", firstName: "Keisha", lastName: "D.",
    currentWeek: 10, currentDay: 2,
    missedDays: 1, lateDays: 3,
    reportedBarriers: [],
    supportPreference: "none",
    checkedInToday: true,
    checkinHistory: ["great","great","great","worried","struggling","okay","okay","great","great","great"],
    story: "Childcare fell through in week 4. ADES referral helped. Graduating this week.",
    recoveryNote: "ADES childcare referral in week 4. Attendance recovered within 3 days."
  },

  // === NO CHECK-IN YET ===
  {
    id: "P012", firstName: "Fatima", lastName: "A.",
    currentWeek: 3, currentDay: 2,
    missedDays: 0, lateDays: 0,
    reportedBarriers: [],
    supportPreference: "reminder",
    checkedInToday: false,
    checkinHistory: ["great","great","great","great","great"],
    story: "Usually checks in by 7pm. It's 8:30pm."
  },
  {
    id: "P013", firstName: "Robert", lastName: "H.",
    currentWeek: 2, currentDay: 3,
    missedDays: 0, lateDays: 1,
    reportedBarriers: [],
    supportPreference: "reminder",
    checkedInToday: false,
    checkinHistory: ["okay","okay","okay"],
    story: "Has been consistent but quiet. No check-in tonight."
  },

  // === REST OF COHORT ===
  { id: "P014", firstName: "Sandra", lastName: "P.", currentWeek: 4, currentDay: 2, missedDays: 0, lateDays: 0, reportedBarriers: [], supportPreference: "none", checkedInToday: true, checkinHistory: ["great","great","great","great","great","great","great","great"] },
  { id: "P015", firstName: "Jerome", lastName: "M.", currentWeek: 4, currentDay: 2, missedDays: 0, lateDays: 1, reportedBarriers: [], supportPreference: "reminder", checkedInToday: true, checkinHistory: ["okay","great","great","great","great","great"] },
  { id: "P016", firstName: "Ana", lastName: "L.", currentWeek: 3, currentDay: 2, missedDays: 0, lateDays: 0, reportedBarriers: [], supportPreference: "none", checkedInToday: true, checkinHistory: ["great","great","great","great","great"] },
  { id: "P017", firstName: "David", lastName: "O.", currentWeek: 5, currentDay: 3, missedDays: 0, lateDays: 0, reportedBarriers: [], supportPreference: "none", checkedInToday: true, checkinHistory: ["great","great","great","great","great","great"] },
  { id: "P018", firstName: "Carmen", lastName: "F.", currentWeek: 1, currentDay: 4, missedDays: 0, lateDays: 0, reportedBarriers: [], supportPreference: "none", checkedInToday: true, checkinHistory: ["okay","okay","okay","great"] },
  { id: "P019", firstName: "Michael", lastName: "N.", currentWeek: 6, currentDay: 1, missedDays: 1, lateDays: 2, reportedBarriers: ["transportation"], supportPreference: "resources", checkedInToday: true, checkinHistory: ["great","great","great","great","great","worried"] },
  { id: "P020", firstName: "Esperanza", lastName: "R.", currentWeek: 2, currentDay: 2, missedDays: 0, lateDays: 0, reportedBarriers: [], supportPreference: "none", checkedInToday: true, checkinHistory: ["okay","great","great","great"] }
];
