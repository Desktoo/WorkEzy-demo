"use client";

import { LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
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

export default function SignOutButtonClient() {
  const { signOut } = useClerk();

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-black">
        <LogOut className="h-4 w-4" />
        Sign Out
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out of Workezy?</AlertDialogTitle>
          <AlertDialogDescription>
            You’ll be signed out of your account on this device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => signOut({ redirectUrl: "/" })}>
            Sign Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
