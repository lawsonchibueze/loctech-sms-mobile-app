import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface Branch {
  id: string;
  name: string;
  location: string;
  staffCount: number;
  studentCount: number;
}

interface BranchDetail extends Branch {
  attendanceRate: number;
  revenue: number;
}

interface InstructorReport {
  id: string;
  instructorName: string;
  date: string;
  status: "pending" | "submitted" | "reviewed" | "flagged";
  summary?: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  branchName: string;
  status: "active" | "inactive";
}

interface EnrollmentAnalytics {
  totalEnrollments: number;
  thisMonth: number;
  trend: number;
  byProgram: { name: string; count: number }[];
}

interface FinancialAnalytics {
  totalRevenue: number;
  thisMonth: number;
  outstanding: number;
  collectionRate: number;
}

export function useBranches() {
  return useQuery({
    queryKey: ["admin", "branches"],
    queryFn: () => api.get<Branch[]>("/sms/admin/branches"),
  });
}

export function useBranchDetail(branchId: string) {
  return useQuery({
    queryKey: ["admin", "branch", branchId],
    queryFn: () => api.get<BranchDetail>(`/sms/admin/branches/${branchId}`),
    enabled: !!branchId,
  });
}

export function useInstructorReportsAdmin() {
  return useQuery({
    queryKey: ["admin", "instructor-reports"],
    queryFn: () => api.get<InstructorReport[]>("/sms/admin/instructor-reports"),
  });
}

export function useStaffList() {
  return useQuery({
    queryKey: ["admin", "staff"],
    queryFn: () => api.get<StaffMember[]>("/sms/admin/staff"),
  });
}

export function useEnrollmentAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics", "enrollment"],
    queryFn: () => api.get<EnrollmentAnalytics>("/sms/admin/reports/enrollment"),
  });
}

export function useFinancialAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics", "financial"],
    queryFn: () => api.get<FinancialAnalytics>("/sms/admin/reports/financial"),
  });
}
