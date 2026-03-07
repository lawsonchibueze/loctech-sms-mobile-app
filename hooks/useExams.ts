import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface Exam {
  id: string;
  title: string;
  courseTitle: string;
  duration: number;
  totalQuestions: number;
  status: "upcoming" | "available" | "completed" | "missed";
  scheduledAt: string;
  score?: number;
}

interface ExamResult {
  id: string;
  examTitle: string;
  courseTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  grade: string;
  passed: boolean;
  completedAt: string;
}

export function useExams() {
  return useQuery({
    queryKey: ["student", "exams"],
    queryFn: () => api.get<Exam[]>("/sms/assessments/my-exams"),
  });
}

export function useExamResult(examId: string) {
  return useQuery({
    queryKey: ["exam-result", examId],
    queryFn: () => api.get<ExamResult>(`/sms/assessments/exams/${examId}/result`),
    enabled: !!examId,
  });
}
