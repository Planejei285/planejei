import SiteHeader from "@/components/SiteHeader";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "@/config/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAdminSession } from "@/lib/local-auth";
import { FormEvent, useState } from "react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setAdminSession(true);
      navigate("/admin");
      return;
    }
    alert("Credenciais inválidas.");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-12">
        <Card className="mx-auto w-full max-w-lg rounded-[2rem] border-slate-200 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Área administrativa</h1>
          <p className="mt-3 text-slate-600">Entre com o email e a senha do administrador para acessar o painel interno.</p>
          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Senha</Label>
              <Input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" />
            </div>
            <Button type="submit" className="w-full">Entrar no admin</Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
