"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function RegisterClient() {
  const router = useRouter();
  const search = useSearchParams();
  const redirectTo = useMemo(() => search.get("redirect") || "/dashboard", [search]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !password2) {
      toast.error("Completa todos los campos");
      return;
    }
    if (password !== password2) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      const { error } = await authClient.signUp.email({ email, name, password });
      if (error?.code) {
        const map: Record<string, string> = { USER_ALREADY_EXISTS: "Email ya registrado" };
        toast.error(map[error.code] || "Registro fallido");
        return;
      }
      toast.success("Cuenta creada. Revisa tu correo para verificar.");
      router.push(`/login?registered=true&redirect=${encodeURIComponent(redirectTo)}`);
    } catch (e: any) {
      toast.error("No se pudo registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-10 max-w-md">
      <Card className="border-border/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>
            Regístrate para compartir, calificar y comentar prompts. ¿Ya tienes cuenta? {" "}
            <Link href="/login" className="underline">Inicia sesión</Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password2">Confirmar contraseña</Label>
            <Input id="password2" type="password" autoComplete="off" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="********" />
          </div>
          <Button className="w-full" onClick={handleRegister} disabled={loading}>
            {loading ? "Creando..." : "Crear cuenta"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}