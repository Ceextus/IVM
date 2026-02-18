"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getInvoiceById } from "@/lib/api";
import { Invoice } from "@/types/invoice";
import InvoiceForm from "@/components/InvoiceForm";
import AppLayout from "@/components/AppLayout";

export default function EditInvoicePage() {
  const params = useParams();
  const id = params.id as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getInvoiceById(id);
      setInvoice(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-8 max-w-6xl mx-auto">
          <div className="h-8 bg-white rounded border w-48" />
          <div className="h-[600px] bg-white rounded-xl border" />
        </div>
      </AppLayout>
    );
  }

  if (!invoice) {
    return (
      <AppLayout>
        <div className="text-center py-20 max-w-6xl mx-auto">
          <h2 className="text-xl font-bold dark:text-white">
            Invoice not found
          </h2>
          <Link
            href="/invoices"
            className="text-[#10B981] mt-4 inline-block hover:underline"
          >
            Back to list
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/invoices/${id}`}
            className="p-2 hover:bg-slate-100 rounded-lg dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Edit Invoice
            </h1>
            <p className="text-sm text-slate-500">
              Update details for {invoice.invoiceNumber}
            </p>
          </div>
        </div>

        <InvoiceForm key={invoice.id} initialData={invoice} />
      </div>
    </AppLayout>
  );
}
