"use client";

import { useInvoiceStore } from "@/store/invoiceStore";
import { InvoiceStatus } from "@/types/invoice";
import { Search } from "lucide-react";

export default function InvoiceFilters() {
  const filters = useInvoiceStore((state) => state.filters);
  const setFilters = useInvoiceStore((state) => state.setFilters);

  return (
    <div className="flex flex-col md:flex-row items-end gap-4 bg-white p-6 rounded-xl border card-shadow dark:bg-slate-950 dark:border-slate-800">
      <div className="flex-1 w-full space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Search
        </label>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by client name..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] dark:bg-slate-900 dark:border-slate-800 dark:text-white"
          />
        </div>
      </div>

      <div className="w-full md:w-48 space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({ status: e.target.value as InvoiceStatus | "all" })
          }
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none dark:bg-slate-900 dark:border-slate-800 dark:text-white"
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="w-full md:w-48 space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Start Date
        </label>
        <input
          type="date"
          value={filters.dateFrom ?? ""}
          onChange={(e) => setFilters({ dateFrom: e.target.value || null })}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none dark:bg-slate-900 dark:border-slate-800 dark:text-white"
        />
      </div>

      <div className="w-full md:w-48 space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          End Date
        </label>
        <input
          type="date"
          value={filters.dateTo ?? ""}
          onChange={(e) => setFilters({ dateTo: e.target.value || null })}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none dark:bg-slate-900 dark:border-slate-800 dark:text-white"
        />
      </div>

      <button
        onClick={() =>
          setFilters({
            status: "all",
            dateFrom: null,
            dateTo: null,
            search: "",
          })
        }
        className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
      >
        Reset Filters
      </button>
    </div>
  );
}
