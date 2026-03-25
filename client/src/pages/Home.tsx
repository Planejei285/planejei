import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocalUserAuth } from "@/lib/local-auth";
import { ArrowRight, CheckCircle2, Wallet, CalendarRange, Target, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const auth = useLocalUserAuth();
  const [, navigate] = useLocation();

  const features = [
    {
      icon: CalendarRange,
      title: "Planejamento diário, semanal e mensal",
      description: "Organize tarefas, compromissos e prioridades em uma rotina mais leve e visual.",
    },
    {
      icon: Wallet,
      title: "Controle financeiro no mesmo lugar",
      description: "Acompanhe entradas, gastos e metas sem depender de várias ferramentas separadas.",
    },
    {
      icon: Target,
      title: "Foco no que realmente importa",
      description: "Transforme objetivos em ações simples, com clareza e menos sensação de bagunça.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader user={auth.user} onLogout={auth.logout} />

      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              login, logout e área interna de administração
            </div>

            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
              Organize sua rotina com mais clareza, foco e praticidade.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              O Planejei reúne planejamento pessoal, metas e controle financeiro em um só lugar.
              Uma ferramenta simples para quem quer colocar a vida em ordem sem complicação.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => navigate(auth.isAuthenticated ? "/dashboard" : "/signup")}>
                {auth.isAuthenticated ? "Abrir meu painel" : "Começar grátis"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/pricing")}>
                Ver planos
              </Button>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> plano grátis para começar</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> upgrade por link de pagamento</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> área administrativa reservada</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> dados salvos localmente</div>
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="rounded-3xl border-slate-200 p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Hoje</p>
                  <p className="text-2xl font-semibold text-slate-900">Minha rotina</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">em dia</span>
              </div>
              <div className="space-y-3">
                {[
                  "Definir prioridades do dia",
                  "Revisar metas da semana",
                  "Lançar despesas e receitas",
                  "Separar tarefas concluídas",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="rounded-3xl border-slate-200 p-6 shadow-sm">
                <p className="text-sm text-slate-500">Plano atual</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">Free</p>
                <p className="mt-2 text-sm text-slate-600">20 tarefas por mês para começar sem custo.</p>
              </Card>
              <Card className="rounded-3xl border-slate-200 p-6 shadow-sm">
                <p className="text-sm text-slate-500">Admin interno</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">Seguro</p>
                <p className="mt-2 text-sm text-slate-600">Acesso separado para administrar usuários e pagamentos.</p>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-slate-900">Tudo em um só lugar</h2>
              <p className="mt-3 text-slate-600">
                O Planejei foi pensado para servir tanto quem precisa se organizar melhor quanto quem quer acompanhar tarefas e finanças com simplicidade.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="rounded-3xl border-slate-200 p-6 shadow-sm">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <Card className="rounded-[2rem] border-slate-200 bg-slate-900 p-8 text-white shadow-sm md:p-12">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold md:text-4xl">Comece grátis e evolua no seu ritmo.</h2>
              <p className="mt-4 text-slate-300">
                Você entra sem custo, testa o aplicativo e só faz upgrade quando quiser liberar mais capacidade. O acesso é simples e você ainda pode administrar tudo em uma área interna exclusiva.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="secondary" size="lg" onClick={() => navigate("/pricing")}>
                  Comparar planos
                </Button>
                <Button size="lg" className="border border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => navigate("/admin-login")}>
                  Acessar área administrativa
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
