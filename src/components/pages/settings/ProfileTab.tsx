"use client";

import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEmployerStore } from "@/store/global-store/employer.store";
import { Info } from "lucide-react";
import Image from "next/image";

export default function ProfileTab() {
  const { employer } = useEmployerStore();

  // TODO: remove this console and make the bucket private again with the updates(using signedUrls)
  console.log("company LOGO:  ", employer?.companyLogo);

  return (
    <Card className="w-full px-5 my-4">
      <CardTitle className="flex flex-col gap-2">
        <label className="text-xl font-bold">Your Profile</label>
        <label className="text-gray-600 font-normal">
          This is the information associated with your account.
        </label>
      </CardTitle>
      <Card className="bg-[#F6F7F9] px-5 py-3">
        <CardDescription className="gap-2 flex">
          <div className="text-black mt-1">
            <Info />
          </div>
          <div>
            <h1 className="text-black font-semibold text-base">
              Read-Only Information
            </h1>
            These details are based on your registration and cannot be changed
            here. Please contact support for any modifications.
          </div>
        </CardDescription>
      </Card>
      <div className=" flex gap-10 items-center">
        <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-200">
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
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">
            {employer?.companyName ?? "Company Name"}
          </h1>
          <p className="text-gray-600">{employer?.industry ?? "Industry"}</p>
        </div>
      </div>
      <Separator className="mt-4" />
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-bold">Personal Details</h1>
        <div className="grid grid-cols-2  max-w-2xl">
          <div className="flex flex-col text-gray-600 font-semibold text-sm gap-2">
            <label>Full Name</label>
            <label>Email</label>
            <label>Gender</label>
            <label>Designation</label>
          </div>
          <div className="flex flex-col font-semibold text-sm gap-2">
            <label>{employer?.fullName || "--"}</label>
            <label>{employer?.email || "--"}</label>
            <label>{employer?.gender || "--"}</label>
            <label>{employer?.designation || "--"}</label>
          </div>
        </div>
      </div>
      <Separator className="mt-4" />
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-bold">Company Details</h1>
        <div className="grid grid-cols-2  max-w-2xl">
          <div className="flex flex-col text-gray-600 font-semibold text-sm gap-2">
            <label>Company Name</label>
            <label>Number of Employees</label>
            <label>Industry</label>
            <label>City</label>
            <label>State</label>
            <label>Country</label>
            <label>Social Media</label>
          </div>
          <div className="flex flex-col font-semibold text-sm gap-2">
            <label>{employer?.companyName || "-"}</label>
            <label>{employer?.numOfEmployees || "-"}</label>
            <label>{employer?.industry || "-"}</label>
            <label>{employer?.city || "-"}</label>
            <label>{employer?.state || "-"}</label>
            <label>{employer?.country || "-"}</label>
            <label>{employer?.socialMedia || "--"}</label>
          </div>
        </div>
      </div>
      <Separator className="mt-4" />
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-bold">Verification Documents</h1>
        <p className="text-gray-600 font-semibold">
          These documents were provided during registration for verification.
        </p>
        <div className="grid grid-cols-2 gap-5 md:gap-10">
          <div className="flex flex-col w-full gap-2">
            <label className="font-semibold text-sm ml-2">PAN Card</label>
            <Card className="">
              <CardContent className="text-gray-500 truncate">
                {employer?.panCard}
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col w-full gap-2">
            <label className="font-semibold text-sm ml-2 truncate">
              Company GST Certificate
            </label>
            <Card className="">
              <CardContent className="text-gray-500 truncate">
                {/* TODO: MAke things like gstCerti and panCard in a signed url so they can be seen on browsers */}
                {employer?.gstCertificate}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Card>
  );
}

// TODO: use this after the authentication is done for the app
// import {
//   Card,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Info } from "lucide-react";
// import Image from "next/image";

// type ProfileTabProps = {
//   employer: {
//     companyLogo?: string | null;
//     companyName?: string | null;
//     industry?: string | null;
//     fullName?: string | null;
//     email?: string | null;
//     gender?: string | null;
//     designation?: string | null;
//     numOfEmployees?: string | null;
//     city?: string | null;
//     state?: string | null;
//     country?: string | null;
//     socialMedia?: string | null;
//     panCard?: string | null;
//     gstCertificate?: string | null;
//   } | null;
// };

// export default function ProfileTab({ employer }: ProfileTabProps) {
//   return (
//     <Card className="w-full px-5 my-4">
//       <CardTitle className="flex flex-col gap-2">
//         <label className="text-xl font-bold">Your Profile</label>
//         <label className="text-gray-600 font-normal">
//           This is the information associated with your account.
//         </label>
//       </CardTitle>

//       <Card className="bg-[#F6F7F9] px-5 py-3">
//         <CardDescription className="gap-2 flex">
//           <div className="text-black mt-1">
//             <Info />
//           </div>
//           <div>
//             <h1 className="text-black font-semibold text-base">
//               Read-Only Information
//             </h1>
//             These details are based on your registration and cannot be changed
//             here. Please contact support for any modifications.
//           </div>
//         </CardDescription>
//       </Card>

//       <div className="flex gap-10 items-center">
//         <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-200">
//           {employer?.companyLogo ? (
//             <Image
//               src={employer.companyLogo}
//               alt="Company logo"
//               width={110}
//               height={110}
//               className="rounded"
//             />
//           ) : (
//             <div className="h-30 w-30 bg-gray-200 rounded flex items-center justify-center text-xs">
//               No Logo
//             </div>
//           )}
//         </div>

//         <div className="flex flex-col gap-1">
//           <h1 className="text-xl font-bold">
//             {employer?.companyName ?? "Company Name"}
//           </h1>
//           <p className="text-gray-600">
//             {employer?.industry ?? "Industry"}
//           </p>
//         </div>
//       </div>

//       <Separator className="mt-4" />

//       <div className="flex flex-col gap-4">
//         <h1 className="text-lg font-bold">Personal Details</h1>
//         <div className="grid grid-cols-2 max-w-2xl">
//           <div className="flex flex-col text-gray-600 font-semibold text-sm gap-2">
//             <label>Full Name</label>
//             <label>Email</label>
//             <label>Gender</label>
//             <label>Designation</label>
//           </div>
//           <div className="flex flex-col font-semibold text-sm gap-2">
//             <label>{employer?.fullName || "--"}</label>
//             <label>{employer?.email || "--"}</label>
//             <label>{employer?.gender || "--"}</label>
//             <label>{employer?.designation || "--"}</label>
//           </div>
//         </div>
//       </div>

//       <Separator className="mt-4" />

//       <div className="flex flex-col gap-4">
//         <h1 className="text-lg font-bold">Company Details</h1>
//         <div className="grid grid-cols-2 max-w-2xl">
//           <div className="flex flex-col text-gray-600 font-semibold text-sm gap-2">
//             <label>Company Name</label>
//             <label>Number of Employees</label>
//             <label>Industry</label>
//             <label>City</label>
//             <label>State</label>
//             <label>Country</label>
//             <label>Social Media</label>
//           </div>
//           <div className="flex flex-col font-semibold text-sm gap-2">
//             <label>{employer?.companyName || "-"}</label>
//             <label>{employer?.numOfEmployees || "-"}</label>
//             <label>{employer?.industry || "-"}</label>
//             <label>{employer?.city || "-"}</label>
//             <label>{employer?.state || "-"}</label>
//             <label>{employer?.country || "-"}</label>
//             <label>{employer?.socialMedia || "--"}</label>
//           </div>
//         </div>
//       </div>

//       <Separator className="mt-4" />

//       <div className="flex flex-col gap-4">
//         <h1 className="text-lg font-bold">Verification Documents</h1>
//         <p className="text-gray-600 font-semibold">
//           These documents were provided during registration for verification.
//         </p>

//         <div className="grid grid-cols-2 gap-5 md:gap-10">
//           <div className="flex flex-col w-full gap-2">
//             <label className="font-semibold text-sm ml-2">PAN Card</label>
//             <Card>
//               <CardContent className="text-gray-500 truncate">
//                 {employer?.panCard || "--"}
//               </CardContent>
//             </Card>
//           </div>

//           <div className="flex flex-col w-full gap-2">
//             <label className="font-semibold text-sm ml-2 truncate">
//               Company GST Certificate
//             </label>
//             <Card>
//               <CardContent className="text-gray-500 truncate">
//                 {employer?.gstCertificate ? (
//                   <a
//                     href={employer.gstCertificate}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 underline hover:text-blue-800"
//                   >
//                     View PAN Card
//                   </a>
//                 ) : (
//                   "--"
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// }
