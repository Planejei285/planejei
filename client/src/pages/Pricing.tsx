import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getStoredPlan, setStoredPlan, useLocalUserAuth } from "@/lib/local-auth";
import { getPaymentLink } from "@/config/payments";
import { CheckCircle2, Crown } from "lucide-react";
import { useLocation } from "wouter";

export default function Pricing() {
  const auth = useLocalUserAuth();
  const [, navigate] = useLocation();
  const currentPlan = getStoredPlan();

  const handleSelectPlan = (plan: "free" | "basic" | "premium") => {
    if (plan === "free") {
      setStoredPlan("free");
      navigate("/dashboard");
      return;
    }

    const link = getPaymentLink(plan);
    if (!link) {
      alert(`Configure o link de pagamento do plano ${plan} em client/src/config/payments.ts ou nas variáveis VITE_MP_BASIC_URL / VITE_MP_PREMIUM_URL.`);
      return;
    }
    setStoredPlan(plan);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const plans = [
    {
      key: "free" as const,
      title: "Free",
      price: "R$ 0",
      subtitle: "ideal para começar",
      features: ["20 tarefas por mês", "Planejamento diário", "Controle básico", "Sem cobrança"],
    },
    {
      key: "basic" as const,
      title: "Básico",
      price: "R$ 20/mês",
      subtitle: "mais espaço para organizar",
      features: ["100 tarefas por mês", "Planejamento diário, semanal e mensal", "Financeiro", "Acesso contínuo"],
    },
    {
      key: "premium" as const,
      title: "Premium",
      price: "R$ 35/mês",
      subtitle: "experiência completa",
      features: ["Tarefas ilimitadas", "Todos os módulos liberados", "Melhor opção para uso intenso", "Mais liberdade para crescer"],
      featured: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader user={auth.user} onLogout={auth.logout} />

      <main className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">planos</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">Escolha o plano ideal para o seu momento</h1>
          <p className="mt-4 text-lg text-slate-600">
            Você pode começar gratuitamente e fazer upgrade quando quiser. Para receber no seu banco, basta usar os links do Mercado Pago configurados no projeto.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.key}
              className={`rounded-[2rem] p-8 shadow-sm ${plan.featured ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{plan.title}</h2>
                  <p className={`mt-2 text-sm ${plan.featured ? "text-slate-300" : "text-slate-500"}`}>{plan.subtitle}</p>
                </div>
                {plan.featured && <Crown className="h-6 w-6" />}
              </div>

              <p className="mt-8 text-4xl font-bold">{plan.price}</p>

              <div className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className={`h-5 w-5 ${plan.featured ? "text-white" : "text-emerald-600"}`} />
                    <span className={plan.featured ? "text-slate-100" : "text-slate-700"}>{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`mt-8 w-full ${plan.featured ? "bg-white text-slate-900 hover:bg-slate-100" : ""}`}
                variant={plan.featured ? "secondary" : "default"}
                onClick={() => handleSelectPlan(plan.key)}
              >
                {currentPlan === plan.key ? "Plano atual" : plan.key === "free" ? "Começar grátis" : "Assinar plano"}
              </Button>
            </Card>
          ))}
        </div>

        <Card className="mt-10 rounded-[2rem] border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Como receber no seu banco</h3>
          <p className="mt-3 leading-7 text-slate-600">
            O projeto está preparado para abrir links de pagamento externos. Você pode colar os links do Mercado Pago em <span className="font-medium text-slate-900">client/src/config/payments.ts</span> ou nas variáveis de ambiente <span className="font-medium text-slate-900">VITE_MP_BASIC_URL</span> e <span className="font-medium text-slate-900">VITE_MP_PREMIUM_URL</span>. Assim, o valor cai na sua conta do Mercado Pago e depois você transfere para o seu banco.
          </p>
        </Card>
      </main>
    </div>
  );
}
