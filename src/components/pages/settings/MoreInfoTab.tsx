"use client";

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
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useClerk } from "@clerk/nextjs";
import axios from "axios";
import { Building, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function MoreInfoTab() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { signOut } = useClerk();

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);

      await axios.delete("/api/account/delete");

      await signOut();

      toast.success("Account deleted successfully");

      // Redirect after delete
      router.replace("/");
    } catch (err) {
      console.error("Delete account failed:", err);
      toast.error("Failed to delete account");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-4 my-4">
      <Card className="px-4">
        <CardTitle className="flex flex-col gap-2">
          <label className="text-2xl font-bold">About Us</label>
          <label className="text-gray-500 font-medium">
            Learn more about our mission and vision.
          </label>
        </CardTitle>
        <CardDescription className="text-base text-gray-700">
          Workezy is dedicated to bridging the gap between skilled blue-collar
          workers and reputable employers across India. Our platform simplifies
          the hiring process, enabling companies to find reliable talent and job
          seekers to discover meaningful opportunities. We believe in creating a
          fair and transparent ecosystem that empowers both employers and
          employees, fostering growth and prosperity for all.
        </CardDescription>
      </Card>
      <Card className="px-4">
        <CardTitle className="flex flex-col gap-2">
          <label className="text-2xl font-bold">Contact Us</label>
          <label className="text-gray-500 font-medium">
            Have questions? We&apos;re here to help.
          </label>
        </CardTitle>
        {/* Email */}
        <div className="flex items-start gap-4">
          <Mail className="h-6 w-6 text-muted-foreground mt-1" />
          <div className="flex flex-col">
            <span className="font-semibold text-black">Support Email</span>
            <span className="text-[#BE4145] font-medium">info@workezy.org</span>
          </div>
        </div>
        {/* Mobile No. */}
        <div className="flex items-start gap-4">
          <Phone className="h-6 w-6 text-muted-foreground mt-1" />
          <div className="flex flex-col">
            <span className="font-semibold text-black">Phone</span>
            <span className="text-gray-500 font-medium">+91 94612 99504</span>
          </div>
        </div>
        {/* Office Address */}
        <div className="flex items-start gap-4">
          <Building className="h-6 w-6 text-muted-foreground mt-1" />
          <div className="flex flex-col">
            <span className="font-semibold text-black">Office Address</span>
            <span className="text-gray-500 font-medium">
              Mahaveer Nagar Extension, Kota, Rajasthan, 324009, India
            </span>
          </div>
        </div>
      </Card>
      <Card className="px-4 border border-[#BE4145]">
        <CardTitle className="flex flex-col gap-2">
          <label className="text-2xl font-bold text-[#BE4145]">
            Delete Account
          </label>
          <label className="text-gray-500 font-medium">
            Permanently delete your account and all associated data.
          </label>
        </CardTitle>

        <CardDescription className="text-left text-gray-700">
          This action is irreversible. All your job postings, company
          information, and personal data will be permanently removed.
        </CardDescription>

        <div className="max-w-xl mt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="bg-[#BE4145]">
                Delete My Account
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Permanently delete your account?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  This action cannot be undone. All your data will be erased.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="bg-[#BE4145] hover:bg-red-700"
                >
                  {loading ? "Deleting..." : "Yes, delete my account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  );
}
