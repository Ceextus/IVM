"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useFilteredInvoices } from "@/hooks/useFilteredInvoices";
import InvoiceFilters from "@/components/InvoiceFilters";
import InvoiceTable from "@/components/InvoiceTable";
import AppLayout from "@/components/AppLayout";

export default function InvoicesPage() {
  const { fetchInvoices, loading } = useInvoiceStore();
  const filteredInvoices = useFilteredInvoices();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Invoices & Quotes
            </h1>
            <p className="text-slate-500 mt-1">
              Manage your business documents
            </p>
          </div>
          <Link
            href="/invoices/new"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#10B981] text-white rounded-md text-sm font-semibold hover:bg-[#059669] transition-colors whitespace-nowrap"
          >
            <Plus size={18} />
            <span>Create Invoice</span>
          </Link>
        </div>

        <InvoiceFilters />

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 bg-white rounded-xl card-shadow animate-pulse dark:bg-slate-900"
              />
            ))}
          </div>
        ) : (
          <InvoiceTable invoices={filteredInvoices} />
        )}
      </div>
    </AppLayout>
  );
}
