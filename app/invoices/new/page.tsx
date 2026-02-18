"use client";

import InvoiceForm from "@/components/InvoiceForm";
import AppLayout from "@/components/AppLayout";
import { FilePlus } from "lucide-react";

export default function NewInvoicePage() {
  return (
    <AppLayout>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
          <FilePlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--text-primary))]">
            New Invoice
          </h1>
          <p className="text-sm text-[hsl(var(--text-tertiary))]">
            Create a new sales invoice
          </p>
        </div>
      </div>
      <InvoiceForm />
    </AppLayout>
  );
}
