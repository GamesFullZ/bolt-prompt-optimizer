import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/sonner";
import { CommunityPageClient } from "./community-client";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Toaster />
      <CommunityPageClient />
    </div>
  );
}