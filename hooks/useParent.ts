import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface Child {
  id: string;
  name: string;
  enrollmentStatus: string;
  avatarUrl?: string;
  courses: number;
  attendanceRate: number;
}

interface ChildDetail {
  id: string;
  name: string;
  enrollmentStatus: string;
  courses: { id: string; title: string; progress: number }[];
  attendanceRate: number;
  recentGrades: { courseTitle: string; grade: number; maxGrade: number }[];
  outstandingBalance: number;
}

interface ChildAttendance {
  attendanceRate: number;
  records: { date: string; status: "present" | "absent" | "late"; courseTitle: string }[];
}

interface ChildGrades {
  grades: { courseTitle: string; grade: number; maxGrade: number; percentage: number; letterGrade: string }[];
}

interface ChildPayments {
  outstandingBalance: number;
  invoices: { id: string; description: string; amount: number; status: string; dueDate: string }[];
}

export function useChildren() {
  return useQuery({
    queryKey: ["parent", "children"],
    queryFn: () => api.get<Child[]>("/sms/profiles/my-children"),
  });
}

export function useChildDetail(childId: string) {
  return useQuery({
    queryKey: ["parent", "child", childId],
    queryFn: () => api.get<ChildDetail>(`/sms/profiles/children/${childId}`),
    enabled: !!childId,
  });
}

export function useChildAttendance(childId: string) {
  return useQuery({
    queryKey: ["parent", "child-attendance", childId],
    queryFn: () => api.get<ChildAttendance>(`/sms/profiles/children/${childId}/attendance`),
    enabled: !!childId,
  });
}

export function useChildGrades(childId: string) {
  return useQuery({
    queryKey: ["parent", "child-grades", childId],
    queryFn: () => api.get<ChildGrades>(`/sms/profiles/children/${childId}/grades`),
    enabled: !!childId,
  });
}

export function useChildPayments(childId: string) {
  return useQuery({
    queryKey: ["parent", "child-payments", childId],
    queryFn: () => api.get<ChildPayments>(`/sms/profiles/children/${childId}/payments`),
    enabled: !!childId,
  });
}
