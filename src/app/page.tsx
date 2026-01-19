import AuthClientPage from "@/components/pages/auth/AuthClientPage";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    redirect("/profile-under-review");
  }

  return <AuthClientPage />;
}
