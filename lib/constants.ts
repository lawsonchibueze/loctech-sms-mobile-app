export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  "https://finovia-v2-production.up.railway.app/api/v2";

export const APP_NAME = "Loctech SMS";

export const ROLES = {
  STUDENT: "student",
  PARENT: "parent",
  INSTRUCTOR: "instructor",
  STAFF: "staff",
  ADMIN: "admin",
} as const;

export const NOTIFICATION_CHANNELS = [
  { id: "attendance", name: "Attendance" },
  { id: "classes", name: "Classes" },
  { id: "payments", name: "Payments" },
  { id: "grades", name: "Grades" },
  { id: "chat", name: "Chat" },
  { id: "reports", name: "Reports" },
  { id: "certificates", name: "Certificates" },
  { id: "general", name: "General" },
] as const;
