"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function LoginClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const search = useSearchParams();
  const redirectTo = useMemo(() => search.get("redirect") || "/dashboard", [search]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      router.push(redirectTo || "/dashboard");
    }
  }, [session, router, redirectTo]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email y contraseña requeridos");
      return;
    }
    try {
      setLoading(true);
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
        callbackURL: redirectTo || "/dashboard",
      });
      if (error?.code) {
        toast.error("Credenciales inválidas. Asegúrate de tener una cuenta registrada.");
        return;
      }
      toast.success("Bienvenido 👋");
      router.push(redirectTo || "/dashboard");
    } catch (e: any) {
      toast.error("No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-10 max-w-md">
      <Card className="border-border/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>
            Accede para compartir, calificar y comentar prompts. ¿No tienes cuenta? {" "}
            <Link href="/register" className="underline">Regístrate</Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="remember" checked={rememberMe} onCheckedChange={(v) => setRememberMe(Boolean(v))} />
            <Label htmlFor="remember" className="text-sm text-muted-foreground">Recordarme</Label>
          </div>
          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}