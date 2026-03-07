import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface Invoice {
  id: string;
  studentName: string;
  description: string;
  amount: number;
  paidAmount: number;
  status: "pending" | "partially_paid" | "paid" | "overdue" | "cancelled";
  dueDate: string;
}

interface PaymentRecord {
  id: string;
  studentName: string;
  amount: number;
  method: string;
  reference: string;
  createdAt: string;
}

interface FinanceDashboard {
  totalRevenue: number;
  outstandingAmount: number;
  collectionRate: number;
  overdueCount: number;
}

export function useFinanceDashboard() {
  return useQuery({
    queryKey: ["finance", "dashboard"],
    queryFn: () => api.get<FinanceDashboard>("/sms/payments/dashboard"),
  });
}

export function useInvoices(status?: string) {
  return useQuery({
    queryKey: ["finance", "invoices", status],
    queryFn: () => api.get<Invoice[]>(`/sms/payments/invoices${status ? `?status=${status}` : ""}`),
  });
}

export function usePayments() {
  return useQuery({
    queryKey: ["finance", "payments"],
    queryFn: () => api.get<PaymentRecord[]>("/sms/payments/records"),
  });
}

export function useOverdueInvoices() {
  return useQuery({
    queryKey: ["finance", "overdue"],
    queryFn: () => api.get<Invoice[]>("/sms/payments/invoices?status=overdue"),
  });
}
