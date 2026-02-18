import { InvoiceStatus } from "@/types/invoice";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  paid: {
    label: "Paid",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30",
  },
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30",
  },
  overdue: {
    label: "Overdue",
    className:
      "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30",
  },
};

interface StatusBadgeProps {
  status: InvoiceStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
