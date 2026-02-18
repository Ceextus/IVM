"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, ExternalLink, MoreHorizontal, Plus } from "lucide-react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatCurrency } from "@/lib/utils";
import AppLayout from "@/components/AppLayout";
import StatusBadge from "@/components/StatusBadge";

export default function DashboardPage() {
  const { fetchInvoices, loading, invoices } = useInvoiceStore();
  const data = useDashboardData();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const recentInvoices = invoices.slice(0, 5);

  if (loading) {
    return (
      <AppLayout>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-white rounded-xl card-shadow animate-pulse dark:bg-slate-900"
            />
          ))}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Overview of your invoicing activity
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border card-shadow dark:bg-slate-950 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-500">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-900 mt-2 dark:text-white line-clamp-1">
              {formatCurrency(data.totalRevenue)}
            </p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">
              +12.5% vs last month
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border card-shadow dark:bg-slate-950 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-500">Paid</p>
            <p className="text-2xl font-bold text-slate-900 mt-2 dark:text-white line-clamp-1">
              {formatCurrency(data.totalPaid)}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {data.paidCount} invoices
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border card-shadow dark:bg-slate-950 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <p className="text-2xl font-bold text-slate-900 mt-2 dark:text-white line-clamp-1">
              {formatCurrency(data.pendingAmount)}
            </p>
            <p className="text-xs text-amber-500 mt-1 font-medium">
              {data.pendingCount} invoices
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border card-shadow dark:bg-slate-950 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-500">Overdue</p>
            <p className="text-2xl font-bold text-red-600 mt-2 line-clamp-1">
              {formatCurrency(data.overdueAmount)}
            </p>
            <p className="text-xs text-red-400 mt-1 font-medium">
              {data.overdueCount} invoices needing attention
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border card-shadow dark:bg-slate-950 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Monthly Revenue
              </h2>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal size={20} />
              </button>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyRevenue}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748B" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748B" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#F8FAFC" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border card-shadow dark:bg-slate-950 dark:border-slate-800 flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 mb-8 dark:text-white">
              Distribution
            </h2>
            <div className="h-[250px] flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.statusDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {data.statusDistribution.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {entry.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-xl border card-shadow overflow-hidden dark:bg-slate-950 dark:border-slate-800">
          <div className="px-6 py-4 border-b flex items-center justify-between dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Invoices
            </h2>
            <Link
              href="/invoices"
              className="text-sm font-semibold text-[#10B981] hover:underline flex items-center gap-1"
            >
              View All <ExternalLink size={14} />
            </Link>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentInvoices.map((invoice) => (
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
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                    {formatCurrency(invoice.total)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={invoice.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
