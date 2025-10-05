import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/sonner";
import { RegisterClient } from "./register-client";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Toaster />
      <RegisterClient />
    </div>
  );
}