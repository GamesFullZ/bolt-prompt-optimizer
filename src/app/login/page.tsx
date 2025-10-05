import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/sonner";
import { LoginClient } from "./login-client";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Toaster />
      <LoginClient />
    </div>
  );
}