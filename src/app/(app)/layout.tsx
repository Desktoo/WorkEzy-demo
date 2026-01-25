"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Menu } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F7F9] ">
      {/* Mobile Sidebar Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
    fixed inset-y-0 left-0 z-50 w-64 bg-white
    transform transition-transform duration-300
    md:sticky md:top-0 md:h-screen md:translate-x-0  
    ${open ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex items-center gap-3 p-4 bg-white border-b md:hidden">
          <button onClick={() => setOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-semibold">Workezy</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
