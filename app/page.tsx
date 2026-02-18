import Link from "next/link";
import {
  Zap,
  ArrowRight,
  BarChart3,
  FileText,
  ShieldCheck,
  Globe,
  Star,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b dark:bg-slate-950/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#10B981] flex items-center justify-center text-white">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
              IVM
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#"
              className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#"
              className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              API
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-bold text-slate-900 dark:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-[#10B981] text-white rounded-lg text-sm font-black uppercase tracking-widest hover:bg-[#059669] transition-all"
            >
              Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full dark:bg-emerald-900/20 dark:border-emerald-800">
            <Star size={14} className="text-[#10B981]" fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#10B981]">
              Voted best SaaS tool 2026
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
            Invoicing <br />
            <span className="text-[#10B981]">reinvented</span> for you.
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto dark:text-slate-400 font-medium leading-relaxed">
            IVM is the all-in-one platform to manage your invoices, track
            payments, and automate your accounting with elegance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-10 py-4 bg-[#10B981] text-white rounded-xl text-base font-black uppercase tracking-widest hover:bg-[#059669] shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1"
            >
              Launch Dashboard
            </Link>
            <button className="w-full sm:w-auto px-10 py-4 border border-slate-200 rounded-xl text-base font-bold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:text-white dark:hover:bg-slate-900 transition-all">
              Watch Demo
            </button>
          </div>

          {/* Minimal App Preview */}
          <div className="relative mt-20 p-2 bg-slate-200 rounded-3xl dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-2xl overflow-hidden animate-fade-in [animation-delay:200ms]">
            <div className="aspect-[16/9] bg-white dark:bg-slate-950 rounded-2xl overflow-hidden flex flex-col">
              <div className="h-10 border-b dark:border-slate-800 flex items-center px-4 gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 flex items-center justify-center text-slate-200 dark:text-slate-800">
                <Zap size={120} fill="currentColor" strokeWidth={0} />
              </div>
            </div>
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
          </div>
        </div>
      </main>

      {/* Social Proof */}
      <section className="py-20 border-y bg-white dark:bg-slate-950 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            Trusted by world leaders
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale pointer-events-none">
            <span className="text-2xl font-black italic">CLOAK</span>
            <span className="text-2xl font-black">VOLT</span>
            <span className="text-2xl font-black tracking-widest leading-none">
              ARC
            </span>
            <span className="text-2xl font-black">SPHERE</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: FileText,
                title: "Smart Management",
                desc: "Create professional invoices in seconds with our intuitive editor.",
              },
              {
                icon: BarChart3,
                title: "Precise Analytics",
                desc: "Track your cash flow with real-time charts and detailed reports.",
              },
              {
                icon: ShieldCheck,
                title: "Safety & Security",
                desc: "Your data is protected by high-standard encryption and stored locally.",
              },
            ].map((f, i) => (
              <div key={i} className="group space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[#10B981] shadow-sm dark:bg-slate-900 dark:border-slate-800 group-hover:scale-110 transition-transform">
                  <f.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {f.desc}
                </p>
                <button className="flex items-center gap-1 text-xs font-black uppercase text-[#10B981] hover:gap-2 transition-all">
                  Learn more <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-20 px-6 border-t dark:border-slate-800 bg-slate-900 dark:bg-black text-white overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
            Ready to simplify your <br /> accounting?
          </h2>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#10B981] text-white rounded-xl text-base font-black uppercase tracking-widest hover:bg-[#059669] shadow-2xl shadow-emerald-500/40 transition-all hover:-translate-y-1"
          >
            Get Started Now <ArrowRight size={20} />
          </Link>
        </div>
        {/* Background Zap Deco */}
        <div className="absolute -bottom-20 -right-20 opacity-5 rotate-12 scale-[3]">
          <Zap size={300} fill="currentColor" />
        </div>
      </footer>
    </div>
  );
}
