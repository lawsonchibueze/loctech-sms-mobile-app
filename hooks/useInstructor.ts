import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface InstructorCourse {
  id: string;
  title: string;
  studentsCount: number;
  nextClassDate?: string;
}

interface InstructorCourseDetail {
  id: string;
  title: string;
  students: { id: string; name: string; progress: number; attendanceRate: number }[];
}

interface DailyReport {
  id: string;
  date: string;
  status: "pending" | "submitted" | "reviewed" | "flagged";
  summary?: string;
  classesHeld: number;
  studentsPresent: number;
}

interface StudentDetail {
  id: string;
  name: string;
  email: string;
  courses: { title: string; progress: number }[];
  attendanceRate: number;
  overallGrade: number;
}

export function useInstructorCourses() {
  return useQuery({
    queryKey: ["instructor", "courses"],
    queryFn: () => api.get<InstructorCourse[]>("/sms/learning/instructor/courses"),
  });
}

export function useInstructorCourseDetail(courseId: string) {
  return useQuery({
    queryKey: ["instructor", "course", courseId],
    queryFn: () => api.get<InstructorCourseDetail>(`/sms/learning/instructor/courses/${courseId}`),
    enabled: !!courseId,
  });
}

export function useInstructorReports() {
  return useQuery({
    queryKey: ["instructor", "reports"],
    queryFn: () => api.get<DailyReport[]>("/sms/instructor-reports"),
  });
}

export function useSubmitDailyReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      summary: string;
      classesHeld: number;
      studentsPresent: number;
      topics: string;
      challenges?: string;
    }) => api.post("/sms/instructor-reports", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor", "reports"] });
    },
  });
}

export function useStudentDetail(studentId: string) {
  return useQuery({
    queryKey: ["instructor", "student", studentId],
    queryFn: () => api.get<StudentDetail>(`/sms/profiles/students/${studentId}`),
    enabled: !!studentId,
  });
}
