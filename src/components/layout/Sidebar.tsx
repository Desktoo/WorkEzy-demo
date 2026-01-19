"use client";

import Image from "next/image";
import Link from "next/link";
import {
  LayoutGrid,
  FileText,
  PlusCircle,
  Settings,
  LogOut,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePathname } from "next/navigation";
import { useEmployerStore } from "@/store/global-store/employer.store";
import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutGrid,
    href: "/dashboard",
  },
  {
    label: "Hiring Poster",
    icon: FileText,
    href: "/hiring-poster",
  },
  {
    label: "Pricing",
    icon: PlusCircle,
    href: "/pricing",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {

  const { signOut } = useClerk()

  const pathName = usePathname();

  const { employer, fetchEmployer } = useEmployerStore();

   useEffect(() => {
    fetchEmployer();
  }, [fetchEmployer]);

  const handleSignOut = async () => {
    await signOut({ redirectUrl: "/" })
  }

  return (
    <aside className="w-64 h-screen border-r bg-white flex flex-col justify-between px-4 py-6">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <Link href="/" className="mb-8 block">
          <Image
            src="/assets/workezy-logo.png"
            alt="Workezy Logo"
            width={140}
            height={40}
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const activeTab = pathName === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition
                  ${
                    activeTab
                      ? "bg-red-50 text-[#BE4145]"
                      : "text-muted-foreground hover:bg-gray-100"
                  }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4">
        <div className="border-t pt-4">
          <button className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-black"></button>
          <AlertDialog>
            <AlertDialogTrigger className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-black">
              <LogOut className="h-4 w-4" />
              Sign Out
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign out of Workezy?</AlertDialogTitle>
                <AlertDialogDescription>
                  You’ll be signed out of your account on this device. You can
                  sign back in anytime.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSignOut}>Sign Out</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 border-t pt-4">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
            {employer?.companyLogo ? (
              <Image
                src={employer.companyLogo}
                alt="Company logo"
                width={110}
                height={110}
                className="rounded"
              />
            ) : (
              <div className="h-30 w-30 bg-gray-200 rounded flex items-center justify-center text-xs">
                No Logo
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              {employer?.fullName ?? "userName"}
            </p>
            <p className="text-xs text-muted-foreground">
              {employer?.email ?? "user@email.com"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
