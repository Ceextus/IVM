"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Upload,
  FileText,
  X,
  FilePlus,
  ShieldCheck,
} from "lucide-react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Invoice, LineItem, Attachment } from "@/types/invoice";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface InvoiceFormProps {
  initialData?: Invoice | null;
}

export default function InvoiceForm({ initialData }: InvoiceFormProps) {
  const { addInvoice, updateInvoice, loading } = useInvoiceStore();
  const router = useRouter();

  const [clientName, setClientName] = useState(initialData?.clientName || "");
  const [issueDate, setIssueDate] = useState(initialData?.issueDate || "");
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [tax, setTax] = useState<number | "">(initialData?.tax ?? 0);
  const [discount, setDiscount] = useState<number | "">(
    initialData?.discount ?? 0,
  );
  const [attachments, setAttachments] = useState<Attachment[]>(
    initialData?.attachments || [],
  );

  const [items, setItems] = useState<any[]>(
    initialData?.items.map((item) => ({ ...item })) || [
      {
        id: uuidv4(),
        description: "",
        quantity: 1,
        unitPrice: "",
        total: 0,
      },
    ],
  );

  const updateItem = (id: string, field: string, value: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };

        const q =
          field === "quantity"
            ? value === ""
              ? 0
              : Number(value)
            : item.quantity;
        const p =
          field === "unitPrice"
            ? value === ""
              ? 0
              : Number(value)
            : item.unitPrice === ""
              ? 0
              : Number(item.unitPrice);

        updated.total = q * p;
        return updated;
      }),
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: uuidv4(), description: "", quantity: 1, unitPrice: "", total: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newAttachment: Attachment = {
        id: uuidv4(),
        name: file.name,
        url: reader.result as string,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };
      setAttachments((prev) => [...prev, newAttachment]);
      toast.success(`${file.name} added`);
    };
    reader.readAsDataURL(file);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const t = tax === "" ? 0 : tax;
    const d = discount === "" ? 0 : discount;
    const taxAmount = subtotal * (t / 100);
    const discountAmount = subtotal * (d / 100);
    const total = subtotal + taxAmount - discountAmount;
    return { subtotal, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !issueDate || !dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const { subtotal, total } = calculateTotals();
    const finalItems = items.map((item) => ({
      ...item,
      quantity: item.quantity === "" ? 0 : Number(item.quantity),
      unitPrice: item.unitPrice === "" ? 0 : Number(item.unitPrice),
    })) as LineItem[];

    if (initialData) {
      const updatedInvoice: Invoice = {
        ...initialData,
        clientName,
        issueDate,
        dueDate,
        items: finalItems,
        subtotal,
        tax: tax === "" ? 0 : tax,
        discount: discount === "" ? 0 : discount,
        total,
        attachments,
        updatedAt: new Date().toISOString(),
      };
      await updateInvoice(updatedInvoice);
      toast.success("Invoice updated successfully");
    } else {
      const newInvoice: Invoice = {
        id: uuidv4(),
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        clientName,
        issueDate,
        dueDate,
        items: finalItems,
        subtotal,
        tax: tax === "" ? 0 : tax,
        discount: discount === "" ? 0 : discount,
        total,
        status: "pending",
        attachments,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await addInvoice(newInvoice);
      toast.success("Invoice created successfully");
    }

    router.push("/invoices");
  };

  const { subtotal, total } = calculateTotals();

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-6xl mx-auto"
    >
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-2xl border card-shadow dark:bg-slate-950 dark:border-slate-800 space-y-8">
          <div className="flex items-center gap-3 pb-6 border-b dark:border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-900/20">
              <FilePlus size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {initialData ? "Update Invoice" : "Invoice Details"}
              </h3>
              <p className="text-xs text-slate-500">
                {initialData
                  ? `Editing ${initialData.invoiceNumber}`
                  : "Fill in the basic information"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Client Name
              </label>
              <input
                type="text"
                placeholder="Ex. Willy Wonka"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] dark:bg-slate-900 dark:border-slate-800 dark:text-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Issue Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] dark:bg-slate-900 dark:border-slate-800 dark:text-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] dark:bg-slate-900 dark:border-slate-800 dark:text-white transition-all"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between pb-2 border-b dark:border-slate-800">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Items & Services
              </label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-[10px] font-black uppercase text-[#10B981] hover:underline"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {/* Column Labels */}
              <div className="hidden md:grid grid-cols-12 gap-3 px-1">
                <label className="col-span-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Description
                </label>
                <label className="col-span-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                  Qty
                </label>
                <label className="col-span-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
                  Price
                </label>
                <div className="col-span-1" />
              </div>

              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 dark:bg-white/[0.02] dark:border-white/5 md:bg-transparent md:p-0 md:border-0 md:grid md:grid-cols-12 md:gap-3 group animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="md:col-span-6 space-y-1">
                    <label className="md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] dark:bg-slate-900 dark:border-slate-800 dark:text-white md:bg-slate-50"
                    />
                  </div>
                  <div className="flex gap-3 md:contents">
                    <div className="flex-1 md:col-span-2 space-y-1">
                      <label className="md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">
                        Qty
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(item.id, "quantity", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-center focus:outline-none dark:bg-slate-900 dark:border-slate-800 dark:text-white md:bg-slate-50"
                      />
                    </div>
                    <div className="flex-[2] md:col-span-3 space-y-1">
                      <label className="md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">
                        Price
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(item.id, "unitPrice", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-right focus:outline-none dark:bg-slate-900 dark:border-slate-800 dark:text-white md:bg-slate-50"
                      />
                    </div>
                    <div className="flex-none flex items-end md:items-center justify-center md:col-span-1 pb-2 md:pb-0">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors bg-white border border-slate-100 rounded-lg shadow-sm md:bg-transparent md:border-0 md:shadow-none"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border card-shadow dark:bg-slate-950 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b dark:border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-900/20">
              <Upload size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Attachments
              </h3>
              <p className="text-xs text-slate-500">Add supporting documents</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="md:col-span-2 relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer dark:border-slate-800 dark:hover:bg-slate-900">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Click to upload
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleFileUpload(e.target.files[0])
                }
              />
            </label>

            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-slate-50 border rounded-lg dark:bg-slate-900 dark:border-slate-800 group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="text-[#10B981] shrink-0" size={16} />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setAttachments((prev) =>
                      prev.filter((a) => a.id !== file.id),
                    )
                  }
                  className="text-slate-400 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6 sticky top-8">
        <div className="bg-white p-8 rounded-2xl border card-shadow dark:bg-slate-950 dark:border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider">
            Financial Summary
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="text-slate-900 dark:text-white font-black">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Tax (%)</span>
                <input
                  type="number"
                  placeholder="0"
                  value={tax}
                  onChange={(e) =>
                    setTax(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="w-16 h-8 text-right bg-slate-50 border rounded px-2 focus:outline-none dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Discount (%)</span>
                <input
                  type="number"
                  placeholder="0"
                  value={discount}
                  onChange={(e) =>
                    setDiscount(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="w-16 h-8 text-right bg-slate-50 border rounded px-2 focus:outline-none dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-6 border-t dark:border-slate-800">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  Total Price
                </span>
                <span className="text-3xl font-black text-[#10B981] tracking-tighter">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 bg-[#10B981] text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#059669] shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
          >
            <ShieldCheck size={20} />
            {loading
              ? "Loading..."
              : initialData
                ? "Update Invoice"
                : "Generate Invoice"}
          </button>

          <p className="text-[10px] text-center text-slate-400 font-medium">
            By clicking {initialData ? "update" : "generate"}, you agree to our{" "}
            <br />
            <Link href="#" className="underline">
              terms and conditions
            </Link>
            .
          </p>
        </div>

        <div className="bg-slate-100 rounded-xl p-5 dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Secure Payment
            </span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed italic">
            All your data is encrypted and stored locally for total privacy.
          </p>
        </div>
      </div>
    </form>
  );
}
