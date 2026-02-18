"use client";

import Sidebar from "@/components/Sidebar";
import { Bell, Mail, Search, ChevronDown } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400">
              <ChevronDown size={18} className="rotate-90" />
              <span className="text-sm font-medium text-slate-500">
                Invoice Details
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <Mail size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 relative dark:hover:text-white">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                12
              </span>
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                <img
                  src="https://ui-avatars.com/api/?name=Mike&background=random"
                  alt="User"
                />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Mike
                </p>
                <p className="text-[10px] text-slate-400">732 829 320 00074</p>
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 animate-fade-in">
          <div className="px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
