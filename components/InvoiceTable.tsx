"use client";

import { useState } from "react";
import Link from "next/link";
import { Invoice } from "@/types/invoice";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate, getEffectiveStatus } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

interface InvoiceTableProps {
  invoices: Invoice[];
}

const PAGE_SIZE = 10;

export default function InvoiceTable({ invoices }: InvoiceTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(invoices.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedInvoices = invoices.slice(startIndex, startIndex + PAGE_SIZE);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  return (
    <div className="bg-white rounded-xl border card-shadow overflow-hidden dark:bg-slate-950 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800">
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Invoice #
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Issue Date
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedInvoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                  {invoice.invoiceNumber}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {invoice.clientName}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {formatDate(invoice.issueDate)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {formatDate(invoice.dueDate)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">
                  {formatCurrency(invoice.total)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={getEffectiveStatus(invoice)} />
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t flex items-center justify-between dark:border-slate-800">
          <p className="text-xs text-slate-500 italic">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + PAGE_SIZE, invoices.length)} of{" "}
            {invoices.length} invoices
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:hover:bg-slate-900"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:hover:bg-slate-900"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
