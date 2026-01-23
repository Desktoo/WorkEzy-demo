import MoreInfoTab from "@/components/pages/settings/MoreInfoTab";
import ProfileTab from "@/components/pages/settings/ProfileTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, User } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-300">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full pt-4 px-4">
        <TabsList className="inline-flex rounded-xl bg-muted p-1 gap-2">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 px-6 py-2 rounded-lg"
          >
            <User className="h-4 w-4" />
            Your Profile
          </TabsTrigger>

          <TabsTrigger
            value="info"
            className="flex items-center gap-2 px-6 py-2 rounded-lg"
          >
            <Info className="h-4 w-4" />
            More Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="w-full">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="info" className="w-full">
          <MoreInfoTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

