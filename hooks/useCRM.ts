import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "enrolled" | "lost";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  status: LeadStatus;
  leadScore: number;
  assignedTo?: string;
  createdAt: string;
  lastContactedAt?: string;
}

interface LeadDetail extends Lead {
  notes: string;
  timeline: { id: string; type: string; description: string; createdAt: string }[];
  interestedProgram?: string;
}

interface CreateLeadPayload {
  name: string;
  email: string;
  phone?: string;
  source: string;
  interestedProgram?: string;
  notes?: string;
}

export function useLeads(status?: LeadStatus) {
  return useQuery({
    queryKey: ["crm", "leads", status],
    queryFn: () => api.get<Lead[]>(`/sms/crm/leads${status ? `?status=${status}` : ""}`),
  });
}

export function useLeadDetail(leadId: string) {
  return useQuery({
    queryKey: ["crm", "lead", leadId],
    queryFn: () => api.get<LeadDetail>(`/sms/crm/leads/${leadId}`),
    enabled: !!leadId,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLeadPayload) => api.post("/sms/crm/leads", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["crm", "leads"] }),
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, status }: { leadId: string; status: LeadStatus }) =>
      api.patch(`/sms/crm/leads/${leadId}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["crm"] }),
  });
}
