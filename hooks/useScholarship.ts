import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ═══ Types ═══════════════════════════════════════════════════════

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  type: "full" | "partial" | "needs_based" | "merit";
  coveragePercent: number;
  maxAwards: number;
  eligibilityRules: {
    minExamScore?: number;
    educationLevels?: string[];
    locations?: string[];
    courseIds?: string[];
    maxAge?: number | null;
  };
  applicationDeadline: string;
  examId: string | null;
  status: "draft" | "open" | "closed" | "awarded";
  academicYear: string;
  createdAt: string;
}

export interface ScholarshipApplication {
  id: string;
  scholarshipId: string;
  scholarshipName?: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  educationLevel: string;
  location: string;
  courseOfInterest: string;
  status:
    | "submitted"
    | "exam_pending"
    | "exam_completed"
    | "under_review"
    | "approved"
    | "rejected"
    | "waitlisted"
    | "enrolled";
  examScore: number | null;
  examPercentage: number | null;
  eligibilityScore: number;
  adminNote: string | null;
  awardedCoveragePercent: number | null;
  createdAt: string;
}

export interface ApplyDto {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  educationLevel: string;
  location: string;
  courseOfInterest: string;
}

// ═══ Hooks ═══════════════════════════════════════════════════════

export function useScholarships() {
  return useQuery({
    queryKey: ["scholarships"],
    queryFn: () => api.get<Scholarship[]>("/sms/scholarships"),
  });
}

export function useScholarship(id: string) {
  return useQuery({
    queryKey: ["scholarships", id],
    queryFn: () => api.get<Scholarship>(`/sms/scholarships/${id}`),
    enabled: !!id,
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: ["scholarships", "my-applications"],
    queryFn: () =>
      api.get<ScholarshipApplication[]>("/sms/scholarships/my-applications"),
  });
}

export function useApplicationStatus(applicationId: string) {
  return useQuery({
    queryKey: ["scholarships", "application", applicationId],
    queryFn: () =>
      api.get<ScholarshipApplication>(
        `/sms/scholarships/applications/${applicationId}`
      ),
    enabled: !!applicationId,
    refetchInterval: 30000, // Poll every 30s for status updates
  });
}

export function useApplyForScholarship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scholarshipId,
      dto,
    }: {
      scholarshipId: string;
      dto: ApplyDto;
    }) =>
      api.post<{ applicationId: string }>(
        `/sms/scholarships/${scholarshipId}/apply`,
        dto
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scholarships"] });
      queryClient.invalidateQueries({
        queryKey: ["scholarships", "my-applications"],
      });
    },
  });
}

// CBT Exam hooks (for scholarship exams)

export interface CbtExam {
  id: string;
  title: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  status: string;
}

export interface CbtUserExam {
  id: string;
  examId: string;
  status: string;
  score: number | null;
  percentage: number | null;
  timeSpent: number | null;
  violationCount: number;
}

export interface ExamQuestion {
  id: string;
  questionText: string;
  questionType: string;
  options: string[] | null;
  difficulty: string;
  points: number;
}

export function useMyCbtExams() {
  return useQuery({
    queryKey: ["cbt", "my-exams"],
    queryFn: () => api.get<CbtUserExam[]>("/sms/cbt/my-exams"),
  });
}

export function useStartExam(examId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api.post<{ userExamId: string; questions: ExamQuestion[] }>(
        `/sms/cbt/start/${examId}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cbt", "my-exams"] });
    },
  });
}

export function useSaveAnswer(userExamId: string) {
  return useMutation({
    mutationFn: (dto: { questionId: string; answer: string }) =>
      api.post(`/sms/cbt/answer/${userExamId}`, dto),
  });
}

export function useSubmitExam(userExamId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post(`/sms/cbt/submit/${userExamId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cbt", "my-exams"] });
      queryClient.invalidateQueries({
        queryKey: ["scholarships", "my-applications"],
      });
    },
  });
}

export function useExamResults(userExamId: string) {
  return useQuery({
    queryKey: ["cbt", "results", userExamId],
    queryFn: () =>
      api.get<{
        score: number;
        percentage: number;
        passed: boolean;
        totalQuestions: number;
        correctAnswers: number;
      }>(`/sms/cbt/results/${userExamId}`),
    enabled: !!userExamId,
  });
}
