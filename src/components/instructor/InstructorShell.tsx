
"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface InstructorShellProps {
  children: React.ReactNode;
}

export default function InstructorShell({
  children,
}: InstructorShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-[260px]">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="min-h-[calc(100vh-78px)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* <footer className="border-t border-slate-100 bg-white px-6 py-5 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Decent Learning. All rights reserved.
        </footer> */}
      </div>
    </div>
  );
}
