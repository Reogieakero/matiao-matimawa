import type { Announcement, Hotline, DocumentApplication, Report } from "./types"
import { initialOfficials } from "./initial-officials"

// In-memory data store (fallback when Redis is not available)
export const dataStore = {
  announcements: [
    {
      id: "1",
      title: "Community Clean-Up Drive This Saturday",
      category: "Events" as const,
      content:
        "Join us for a community clean-up drive this Saturday, March 16th, starting at 7:00 AM. Let's work together to keep our barangay clean and beautiful. Bring your own gloves and trash bags. Snacks will be provided.",
      date: "2025-03-16",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Free Medical Check-Up Available",
      category: "Health" as const,
      content:
        "The barangay health center is offering free medical check-ups every Monday and Wednesday from 9:00 AM to 3:00 PM. Services include blood pressure monitoring, blood sugar testing, and general consultation.",
      date: "2025-03-10",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Flood Warning: Heavy Rains Expected",
      category: "Emergency" as const,
      content:
        "PAGASA has issued a flood warning for our area. Heavy rains are expected in the next 48 hours. Residents in low-lying areas are advised to prepare emergency kits and monitor updates from local authorities.",
      date: "2025-03-15",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      title: "New Curfew Hours for Minors",
      category: "Public Safety" as const,
      content:
        "Effective immediately, the curfew for minors (below 18 years old) is from 10:00 PM to 5:00 AM. Parents and guardians are responsible for ensuring compliance. This is for the safety and welfare of our youth.",
      date: "2025-03-12",
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      title: "Livelihood Training Program Registration Open",
      category: "Community Development" as const,
      content:
        "Registration is now open for our free livelihood training programs including baking, sewing, and basic electronics repair. Limited slots available. Register at the barangay hall from March 18-25.",
      date: "2025-03-18",
      createdAt: new Date().toISOString(),
    },
  ] as Announcement[],

  hotlines: [
    {
      id: "1",
      name: "Barangay Emergency Response",
      department: "Emergency Services",
      number: "+63-123-456-7890",
      description: "24/7 emergency response for all barangay-related emergencies",
    },
    {
      id: "2",
      name: "Police Station",
      department: "Police",
      number: "+63-123-456-7891",
      description: "Local police station for security concerns and emergencies",
    },
    {
      id: "3",
      name: "Fire Department",
      department: "Fire",
      number: "+63-123-456-7892",
      description: "Fire emergency hotline - available 24/7",
    },
    {
      id: "4",
      name: "Barangay Health Center",
      department: "Health",
      number: "+63-123-456-7893",
      description: "Medical assistance and health-related concerns",
    },
    {
      id: "5",
      name: "Disaster Risk Reduction",
      department: "Disaster Response",
      number: "+63-123-456-7894",
      description: "Disaster preparedness and response coordination",
    },
  ] as Hotline[],

  officials: initialOfficials,

  documentApplications: [] as DocumentApplication[],
  reports: [] as Report[],
}
