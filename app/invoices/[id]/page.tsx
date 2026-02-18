"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Download,
  Trash2,
  Edit,
  Printer,
  ChevronLeft,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { getInvoiceById } from "@/lib/api";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Invoice } from "@/types/invoice";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate, getEffectiveStatus } from "@/lib/utils";
import AppLayout from "@/components/AppLayout";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { deleteInvoice, updateInvoice } = useInvoiceStore();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getInvoiceById(id);
      setInvoice(data);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleDelete = async () => {
    await deleteInvoice(id);
    toast.success("Invoice deleted");
    router.push("/invoices");
  };

  const handleMarkAsPaid = async () => {
    if (!invoice) return;
    const updated: Invoice = {
      ...invoice,
      status: "paid",
      updatedAt: new Date().toISOString(),
    };
    await updateInvoice(updated);
    setInvoice(updated);
    toast.success("Invoice marked as paid");
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
          <div className="h-8 bg-slate-200 w-48 rounded dark:bg-slate-800" />
          <div className="h-[600px] bg-white rounded-2xl dark:bg-slate-900 border" />
        </div>
      </AppLayout>
    );
  }

  if (!invoice) {
    return (
      <AppLayout>
        <div className="text-center py-20">
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

  const effectiveStatus = getEffectiveStatus(invoice);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Overdue Alert Banner */}
        {effectiveStatus === "overdue" && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between dark:bg-amber-900/10 dark:border-amber-800 animate-fade-in shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-amber-600" size={20} />
              <div>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  This invoice is overdue
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  The due date was {formatDate(invoice.dueDate)}
                </p>
              </div>
            </div>
            <button
              onClick={handleMarkAsPaid}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors"
            >
              Mark as Paid
            </button>
          </div>
        )}

        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Link
            href="/invoices"
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Invoices
          </Link>

          <div className="flex items-center gap-2">
            {invoice.status !== "paid" && (
              <button
                onClick={handleMarkAsPaid}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/10"
              >
                Mark as Paid
              </button>
            )}
            <Link
              href={`/invoices/${id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 transition-all"
            >
              <Edit size={16} /> Edit
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 dark:bg-slate-950 dark:border-red-900/30 dark:hover:bg-red-900/10 transition-all"
              >
                <Trash2 size={16} /> Delete
              </button>

              {/* Custom Delete Confirmation Modal Overlay */}
              {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
                    <div className="flex items-center gap-3 text-red-600">
                      <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                        <AlertTriangle size={20} />
                      </div>
                      <h4 className="font-bold">Delete Invoice?</h4>
                    </div>
                    <p className="text-sm text-slate-500">
                      Are you sure you want to delete{" "}
                      <span className="font-bold text-slate-900 dark:text-white">
                        #{invoice.invoiceNumber}
                      </span>
                      ? This action cannot be undone.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-2 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-2" />
            <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <Download size={20} />
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <Printer size={20} />
            </button>
          </div>
        </div>

        {/* Simplified Invoice Card */}
        <div className="bg-white rounded-3xl border card-shadow dark:bg-slate-950 dark:border-slate-800 overflow-hidden">
          <div className="p-8 md:p-12 space-y-12">
            {/* Logo and Status */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-2xl">
                  S
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                    IVM
                  </h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                    Invoice #{invoice.invoiceNumber}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={effectiveStatus} />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-3 py-1 bg-slate-100 rounded-full dark:bg-slate-900">
                  Created {formatDate(invoice.createdAt)}
                </p>
              </div>
            </div>

            {/* Bill To / From */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t dark:border-slate-800">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Billed From
                </p>
                <div className="text-sm space-y-1">
                  <p className="font-black text-slate-900 dark:text-white">
                    IVM Inc.
                  </p>
                  <p className="text-slate-500">789 Tech Avenue</p>
                  <p className="text-slate-500">Silicon Valley, CA 94043</p>
                  <p className="text-slate-500">contact@IVM.ai</p>
                </div>
              </div>
              <div className="space-y-4 md:text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Billed To
                </p>
                <div className="text-sm space-y-1">
                  <p className="font-black text-slate-900 dark:text-white">
                    {invoice.clientName}
                  </p>
                  <p className="text-slate-500">Client Address Placeholder</p>
                  <p className="text-slate-500">Tax ID: Optional</p>
                </div>
              </div>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-2xl dark:bg-white/2 border dark:border-white/5">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Issue Date
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatDate(invoice.issueDate)}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Due Date
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatDate(invoice.dueDate)}
                </p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Payment Method
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Bank Transfer
                </p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Invoice Items
              </p>
              <div className="space-y-4">
                {invoice.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-4 border-b last:border-0 dark:border-slate-800"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-900 dark:text-white">
                        {item.description}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.quantity} × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments Section */}
            {invoice.attachments && invoice.attachments.length > 0 && (
              <div className="space-y-6 pt-12 border-t dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Supporting Attachments
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {invoice.attachments.map((file) => {
                    const isImage = file.url.startsWith("data:image/");
                    return (
                      <div
                        key={file.id}
                        className="group relative bg-slate-50 dark:bg-white/2 rounded-xl overflow-hidden border dark:border-white/5 aspect-square"
                      >
                        {isImage ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all cursor-zoom-in"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                            <FileText
                              size={24}
                              className="text-slate-300 group-hover:text-emerald-500 transition-colors"
                            />
                            <span className="text-[10px] text-center font-bold text-slate-500 truncate w-full px-2">
                              {file.name}
                            </span>
                          </div>
                        )}
                        <a
                          href={file.url}
                          download={file.name}
                          className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]"
                        >
                          <div className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <Download size={12} /> View
                          </div>
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Totals Section */}
            <div className="flex flex-col items-end space-y-4 pt-12">
              <div className="w-full md:w-80 space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-slate-900 dark:text-white">
                    {formatCurrency(invoice.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Tax ({invoice.tax}%)</span>
                  <span className="text-slate-900 dark:text-white">
                    {formatCurrency(invoice.subtotal * (invoice.tax / 100))}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Discount ({invoice.discount}%)</span>
                  <span className="text-red-500">
                    -
                    {formatCurrency(
                      invoice.subtotal * (invoice.discount / 100),
                    )}
                  </span>
                </div>
                <div className="pt-6 border-t dark:border-slate-800 flex justify-between items-baseline">
                  <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                    Grand Total
                  </span>
                  <span className="text-4xl font-black text-[#10B981] tracking-tighter">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 md:p-12 dark:bg-black">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Notes & Instructions
                </p>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm italic">
                  Please include the invoice number in your payment reference.
                  Payment is due within 15 days of the issue date. Thank you for
                  your business.
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-black tracking-tighter uppercase text-emerald-500">
                  IVM AI Invoicing
                </p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">
                  Authorized Signature
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
