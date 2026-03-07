import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  category: string;
  totalModules: number;
  completedModules: number;
  progress: number;
  instructorName: string;
}

interface CourseDetail extends Course {
  modules: Module[];
  enrollmentId: string;
  enrolledAt: string;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
  isCompleted: boolean;
}

interface Lesson {
  id: string;
  title: string;
  type: "video" | "text" | "quiz";
  duration?: number;
  isCompleted: boolean;
  videoUrl?: string;
  chapters?: { title: string; timestamp: number }[];
}

interface Assignment {
  id: string;
  title: string;
  courseTitle: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded" | "overdue";
  grade?: number;
  maxGrade: number;
}

interface Grade {
  courseId: string;
  courseTitle: string;
  grade: number;
  maxGrade: number;
  percentage: number;
  letterGrade: string;
}

export function useEnrolledCourses() {
  return useQuery({
    queryKey: ["student", "courses"],
    queryFn: () => api.get<Course[]>("/sms/learning/my-courses"),
  });
}

export function useCourseDetail(courseId: string) {
  return useQuery({
    queryKey: ["student", "course", courseId],
    queryFn: () => api.get<CourseDetail>(`/sms/learning/courses/${courseId}`),
    enabled: !!courseId,
  });
}

export function useAssignments() {
  return useQuery({
    queryKey: ["student", "assignments"],
    queryFn: () => api.get<Assignment[]>("/sms/learning/my-assignments"),
  });
}

export function useGrades() {
  return useQuery({
    queryKey: ["student", "grades"],
    queryFn: () => api.get<Grade[]>("/sms/learning/my-grades"),
  });
}

export function useStudentSchedule() {
  return useQuery({
    queryKey: ["student", "schedule"],
    queryFn: () =>
      api.get<
        {
          id: string;
          courseTitle: string;
          time: string;
          date: string;
          room?: string;
          instructorName: string;
        }[]
      >("/sms/scheduling/my-schedule"),
  });
}

export function useStudentAttendance() {
  return useQuery({
    queryKey: ["student", "attendance"],
    queryFn: () =>
      api.get<{
        attendanceRate: number;
        totalClasses: number;
        attended: number;
        records: {
          date: string;
          status: "present" | "absent" | "late";
          courseTitle: string;
        }[];
      }>("/sms/attendance/my-attendance"),
  });
}

export type { Course, CourseDetail, Module, Lesson, Assignment, Grade };
