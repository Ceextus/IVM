import { useMemo } from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Invoice } from "@/types/invoice";

function computeStatus(invoice: Invoice): Invoice {
  if (invoice.status === "paid") return invoice;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(invoice.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate < today) {
    return { ...invoice, status: "overdue" };
  }
  return { ...invoice, status: "pending" };
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
  paid: number;
}

interface DashboardData {
  totalRevenue: number;
  totalPaid: number;
  pendingAmount: number;
  overdueCount: number;
  overdueAmount: number;
  invoiceCount: number;
  paidCount: number;
  pendingCount: number;
  monthlyRevenue: MonthlyRevenue[];
  statusDistribution: { name: string; value: number; color: string }[];
}

export function useDashboardData(): DashboardData {
  const invoices = useInvoiceStore((state) => state.invoices);

  return useMemo(() => {
    const computed = invoices.map(computeStatus);

    const totalRevenue = computed.reduce((sum, inv) => sum + inv.total, 0);

    const paidInvoices = computed.filter((inv) => inv.status === "paid");
    const pendingInvoices = computed.filter((inv) => inv.status === "pending");
    const overdueInvoices = computed.filter((inv) => inv.status === "overdue");

    const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);

    const monthlyMap = new Map<string, { revenue: number; paid: number }>();
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      monthlyMap.set(key, { revenue: 0, paid: 0 });
    }

    computed.forEach((inv) => {
      const d = new Date(inv.issueDate);
      const key = d.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      if (monthlyMap.has(key)) {
        const entry = monthlyMap.get(key)!;
        entry.revenue += inv.total;
        if (inv.status === "paid") entry.paid += inv.total;
      }
    });

    const monthlyRevenue: MonthlyRevenue[] = Array.from(
      monthlyMap.entries()
    ).map(([month, data]) => ({
      month,
      revenue: Number(data.revenue.toFixed(2)),
      paid: Number(data.paid.toFixed(2)),
    }));

    const statusDistribution = [
      { name: "Paid", value: paidInvoices.length, color: "#10b981" },
      { name: "Pending", value: pendingInvoices.length, color: "#f59e0b" },
      { name: "Overdue", value: overdueInvoices.length, color: "#ef4444" },
    ];

    return {
      totalRevenue,
      totalPaid,
      pendingAmount,
      overdueAmount,
      overdueCount: overdueInvoices.length,
      invoiceCount: computed.length,
      paidCount: paidInvoices.length,
      pendingCount: pendingInvoices.length,
      monthlyRevenue,
      statusDistribution,
    };
  }, [invoices]);
}
