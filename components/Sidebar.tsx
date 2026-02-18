"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Invoicing",
    href: "/invoices",
    icon: FileText,
    current: true,
    children: [
      { name: "Invoices & Quotes", href: "/invoices" },
      { name: "Clients", href: "#" },
      { name: "Products & Services", href: "#" },
    ],
  },
  {
    name: "Management",
    href: "#",
    icon: Users,
    children: [
      { name: "Team", href: "#" },
      { name: "Roles", href: "#" },
    ],
  },
];

const secondaryNavigation = [
  { name: "My Advisor", href: "#", icon: HelpCircle },
  { name: "Help Center", href: "#", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(["Invoicing"]);

  const toggleSection = (name: string) => {
    setOpenSections((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name],
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-white border shadow-sm dark:bg-slate-900"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transition-transform duration-300 transform lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          "dark:bg-slate-950 dark:border-slate-800",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 h-16 border-b dark:border-slate-800">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-[#10B981] text-white">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              IVM
            </span>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto modern-scrollbar">
            {navigation.map((item) => {
              const isSectionOpen = openSections.includes(item.name);
              const isActive =
                pathname === item.href ||
                item.children?.some((child) => pathname === child.href);

              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() =>
                      item.children ? toggleSection(item.name) : null
                    }
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "text-[#10B981] bg-[#10B981]/10"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <Link href={item.children ? "#" : item.href}>
                        {item.name}
                      </Link>
                    </div>
                    {item.children &&
                      (isSectionOpen ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      ))}
                  </button>

                  {item.children && isSectionOpen && (
                    <div className="ml-9 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            pathname === child.href
                              ? "text-[#10B981] bg-[#10B981]/10"
                              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Secondary Nav */}
          <div className="px-4 py-4 border-t dark:border-slate-800 space-y-1">
            {secondaryNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
            >
              {theme === "dark" ? (
                <Zap size={18} />
              ) : (
                <Zap size={18} className="text-slate-400" />
              )}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
