import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalUserAuth } from "@/lib/local-auth";
import { FormEvent, useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const auth = useLocalUserAuth();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Preencha nome e email para entrar.");
      return;
    }
    auth.login(name.trim(), email.trim());
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader user={auth.user} onLogout={auth.logout} />
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-12">
        <Card className="mx-auto w-full max-w-lg rounded-[2rem] border-slate-200 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Entrar no Planejei</h1>
          <p className="mt-3 text-slate-600">Acesse seu painel para organizar tarefas, metas e finanças.</p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
            </div>
            <Button type="submit" className="w-full">Entrar</Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
