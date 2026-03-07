import { Badge } from "@/components/ui/Badge";

type AttendanceStatus = "present" | "late" | "absent" | "half_day" | "excused" | "not_checked_in";

const STATUS_MAP: Record<AttendanceStatus, { label: string; variant: "success" | "warning" | "error" | "info" | "default" }> = {
  present: { label: "Present", variant: "success" },
  late: { label: "Late", variant: "warning" },
  absent: { label: "Absent", variant: "error" },
  half_day: { label: "Half Day", variant: "info" },
  excused: { label: "Excused", variant: "default" },
  not_checked_in: { label: "Not Checked In", variant: "warning" },
};

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
  size?: "sm" | "md";
}

export function AttendanceStatusBadge({ status, size = "sm" }: AttendanceStatusBadgeProps) {
  const config = STATUS_MAP[status] ?? STATUS_MAP.absent;
  return <Badge label={config.label} variant={config.variant} size={size} />;
}
