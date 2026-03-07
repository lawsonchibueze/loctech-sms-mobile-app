import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface CheckInPayload {
  qrData: string;
  latitude?: number;
  longitude?: number;
}

interface LateReasonPayload {
  attendanceId: string;
  reason: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: "present" | "late" | "absent" | "half_day" | "excused";
  lateReason?: string;
  isLate: boolean;
}

interface TeamAttendance {
  id: string;
  staffName: string;
  staffRole: string;
  status: "present" | "late" | "absent" | "half_day" | "excused";
  checkInTime: string | null;
}

interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  lateDays: number;
  absentDays: number;
  attendanceRate: number;
}

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckInPayload) =>
      api.post<AttendanceRecord>("/sms/staff-attendance/check-in", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.post<AttendanceRecord>("/sms/staff-attendance/check-out"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

export function useSubmitLateReason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LateReasonPayload) =>
      api.post("/sms/staff-attendance/late-reason", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

export function useTodayAttendance() {
  return useQuery({
    queryKey: ["attendance", "today"],
    queryFn: () => api.get<AttendanceRecord | null>("/sms/staff-attendance/today"),
  });
}

export function useAttendanceHistory(params?: {
  page?: number;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ["attendance", "history", params],
    queryFn: () =>
      api.get<AttendanceRecord[]>(
        `/sms/staff-attendance/history?page=${params?.page ?? 1}${
          params?.startDate ? `&startDate=${params.startDate}` : ""
        }${params?.endDate ? `&endDate=${params.endDate}` : ""}`
      ),
  });
}

export function useTeamAttendance(date?: string) {
  return useQuery({
    queryKey: ["attendance", "team", date],
    queryFn: () =>
      api.get<TeamAttendance[]>(
        `/sms/staff-attendance/team${date ? `?date=${date}` : ""}`
      ),
  });
}

export function useAttendanceSummary(period?: "week" | "month" | "quarter") {
  return useQuery({
    queryKey: ["attendance", "summary", period],
    queryFn: () =>
      api.get<AttendanceSummary>(
        `/sms/staff-attendance/summary${period ? `?period=${period}` : ""}`
      ),
  });
}
