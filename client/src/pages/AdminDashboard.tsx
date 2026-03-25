import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { hasAdminSession, setAdminSession } from "@/lib/local-auth";
import { Users, CreditCard, BadgeDollarSign, Shield } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const [, navigate] = useLocation();

  if (!hasAdminSession()) {
    navigate("/admin-login");
    return null;
  }

  const logoutAdmin = () => {
    setAdminSession(false);
    navigate("/admin-login");
  };

  const cards = [
    { icon: Users, label: "Total de usuários", value: localStorage.getItem("planejei-user") ? "1" : "0" },
    { icon: CreditCard, label: "Plano atual salvo", value: localStorage.getItem("planejei-plan") || "free" },
    { icon: BadgeDollarSign, label: "Recebimento", value: "Mercado Pago / banco" },
    { icon: Shield, label: "Acesso", value: "Interno" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">admin</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">Painel interno do Planejei</h1>
            <p className="mt-3 max-w-2xl text-slate-600">Área reservada para acompanhar acessos, validar planos e centralizar informações internas do aplicativo.</p>
          </div>
          <Button variant="outline" onClick={logoutAdmin}>Logout admin</Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.label} className="rounded-[2rem] border-slate-200 p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-6 text-sm text-slate-500">{card.label}</p>
                <p className="mt-2 text-2xl font-bold capitalize text-slate-900">{card.value}</p>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className="rounded-[2rem] border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Checklist de produção</h2>
            <div className="mt-6 space-y-4 text-slate-600">
              <p>• Alterar email e senha do admin em client/src/config/admin.ts ou nas variáveis VITE_ADMIN_EMAIL e VITE_ADMIN_PASSWORD.</p>
              <p>• Colar seus links de pagamento do Mercado Pago em client/src/config/payments.ts.</p>
              <p>• Publicar novamente o projeto após as alterações.</p>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Observação importante</h2>
            <p className="mt-6 leading-7 text-slate-600">
              Esta versão já entrega área administrativa, login e logout no aplicativo. Como o projeto está funcionando no lado do cliente, a proteção do admin é visual e funcional, mas não é o mesmo nível de segurança de um backend privado. Para produção mais segura, o ideal é mover o login do admin para o servidor.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
