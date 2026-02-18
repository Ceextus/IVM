import { useMemo } from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Invoice } from "@/types/invoice";

function computeStatus(invoice: Invoice): Invoice {
  // If explicitly marked as paid, respect that
  if (invoice.status === "paid") return invoice;

  // If due date has passed → overdue
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to start of day

  const dueDate = new Date(invoice.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate < today) {
    return { ...invoice, status: "overdue" };
  }

  // Otherwise → pending
  return { ...invoice, status: "pending" };
}

export function useFilteredInvoices() {
  const invoices = useInvoiceStore((state) => state.invoices);
  const filters = useInvoiceStore((state) => state.filters);

  const filtered = useMemo(() => {
    // Apply auto-status to all invoices
    let result = invoices.map(computeStatus);

    // Filter by status
    if (filters.status !== "all") {
      result = result.filter((inv) => inv.status === filters.status);
    }

    // Filter by date range
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      result = result.filter((inv) => new Date(inv.issueDate) >= from);
    }

    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      result = result.filter((inv) => new Date(inv.issueDate) <= to);
    }

    // Filter by client name search
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((inv) =>
        inv.clientName.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [invoices, filters]);

  return filtered;
}
