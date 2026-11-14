
"use client";

import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
} from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  "/instructor": "Dashboard Overview",
  "/instructor/courses": "My Courses",
  "/instructor/students": "My Students",
  "/instructor/analytics": "Analytics",
  "/instructor/messages": "Messages",
  "/instructor/notifications": "Notifications",
  "/instructor/profile": "My Profile",
  "/instructor/settings": "Settings",
};

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  const pageTitle =
    pageTitles[pathname] ||
    (pathname.includes("/courses/create")
      ? "Create New Course"
      : pathname.includes("/edit")
        ? "Edit Course"
        : "Instructor Workspace");

  return (
    <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between gap-4 border-b border-slate-100 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-extrabold text-slate-900 sm:text-xl">
            {pageTitle}
          </h1>

          <p className="hidden text-xs text-slate-400 sm:block">
            Welcome back! Manage your teaching workspace.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="hidden w-full max-w-[350px] items-center gap-3 rounded-xl bg-[#F5F7FB] px-4 py-3 md:flex">
        <Search size={17} className="shrink-0 text-slate-400" />

        <input
          type="search"
          placeholder="Search courses, students..."
          className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl p-2 text-slate-500 transition hover:bg-blue-50 hover:text-[#0A66EC]"
        >
          <Bell size={20} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-extrabold text-[#0A66EC]">
            IN
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-xs font-bold text-slate-800">
              Instructor
            </p>

            <p className="text-[10px] text-slate-400">
              Instructor Account
            </p>
          </div>

          <ChevronDown
            size={15}
            className="hidden text-slate-400 sm:block"
          />
        </button>
      </div>
    </header>
  );
}
