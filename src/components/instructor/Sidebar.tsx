
"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  House,
  BookOpen,
  Users,
  ChartNoAxesCombined,
  UserRound,
  Settings,
  LogOut,
  GraduationCap,
  Plus,
  X,
} from "lucide-react";

const navigation = [
  {
    title: "Overview",
    href: "/instructor",
    icon: House,
  },
  {
    title: "My Courses",
    href: "/instructor/courses",
    icon: BookOpen,
  },
  {
    title: "Students",
    href: "/instructor/students",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/instructor/analytics",
    icon: ChartNoAxesCombined,
  },
];

const accountNavigation = [
  {
    title: "My Profile",
    href: "/instructor/profile",
    icon: UserRound,
  },
  {
    title: "Settings",
    href: "/instructor/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// =====================================
// SIDEBAR CONTENT
// =====================================

function SidebarContent({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // =====================================
  // ACTIVE NAVIGATION
  // =====================================

  const isActive = (href: string) => {
    if (href === "/instructor") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    onClose();
    router.replace("/");
  };

  return (
    <>
      {/* MOBILE OVERLAY */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-100 bg-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* LOGO */}

        <div className="flex h-[85px] items-center justify-between border-b border-slate-100 px-6">
          <Link
            href="/instructor"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A66EC] text-white">
              <GraduationCap size={25} />
            </div>

            <div>
              <h1 className="text-[15px] font-extrabold tracking-tight text-slate-900">
                DECENT
              </h1>

              <p className="text-[10px] font-semibold tracking-[0.16em] text-[#0A66EC]">
                LEARNING
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* MAIN NAVIGATION */}

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-semibold transition ${
                    active
                      ? "bg-blue-50 text-[#0A66EC]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={19} />

                  <span>{item.title}</span>

                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-[#0A66EC]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CREATE COURSE */}

          <Link
            href="/instructor/courses/create"
            onClick={onClose}
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#0A66EC] px-4 py-3 text-[13px] font-bold text-white shadow-sm transition hover:bg-[#185EC1]"
          >
            <Plus size={18} />
            Create New Course
          </Link>

          {/* ACCOUNT */}

          <p className="mb-4 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Account
          </p>

          <nav className="space-y-1.5">
            {accountNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-semibold transition ${
                    active
                      ? "bg-blue-50 text-[#0A66EC]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={19} />
                  {item.title}

                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-[#0A66EC]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* SIGN OUT */}

        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[13px] font-semibold text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={19} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

// =====================================
// SUSPENSE FALLBACK
// =====================================

function SidebarFallback({ isOpen }: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-100 bg-white transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-[85px] items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A66EC] text-white">
          <GraduationCap size={25} />
        </div>

        <div>
          <h1 className="text-[15px] font-extrabold tracking-tight text-slate-900">
            DECENT
          </h1>

          <p className="text-[10px] font-semibold tracking-[0.16em] text-[#0A66EC]">
            LEARNING
          </p>
        </div>
      </div>
    </aside>
  );
}

// =====================================
// MAIN SIDEBAR WITH SUSPENSE
// =====================================

export default function Sidebar(props: SidebarProps) {
  return (
    <Suspense fallback={<SidebarFallback {...props} />}>
      <SidebarContent {...props} />
    </Suspense>
  );
}
