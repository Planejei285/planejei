import { useState } from "react";
import { useLocation } from "wouter";
import { PlannerProvider } from "@/contexts/PlannerContext";
import DailyTab from "@/components/tabs/DailyTab";
import WeeklyTab from "@/components/tabs/WeeklyTab";
import MonthlyTab from "@/components/tabs/MonthlyTab";
import FinancialTab from "@/components/tabs/FinancialTab";
import RewardsTab from "@/components/tabs/RewardsTab";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SiteHeader from "@/components/SiteHeader";
import { getStoredPlan, useLocalUserAuth } from "@/lib/local-auth";

type TabType = "daily" | "weekly" | "monthly" | "financial" | "rewards";

export default function Dashboard() {
  const auth = useLocalUserAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("daily");
  const plan = getStoredPlan();

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: "daily", label: "Dia", icon: "📅" },
    { id: "weekly", label: "Semana", icon: "📊" },
    { id: "monthly", label: "Mês", icon: "🗓️" },
    { id: "financial", label: "Financeiro", icon: "💰" },
    { id: "rewards", label: "Recompensas", icon: "🎁" },
  ];

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50">
        <SiteHeader />
        <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-12">
          <Card className="mx-auto w-full max-w-lg rounded-[2rem] border-slate-200 p-8 text-center shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900">Faça login para acessar seu painel</h1>
            <p className="mt-3 text-slate-600">Entre no Planejei para usar as abas de organização, metas, finanças e recompensas.</p>
            <Button className="mt-8 w-full" onClick={() => navigate("/login")}>Ir para login</Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <PlannerProvider>
      <div className="min-h-screen bg-slate-50">
        <SiteHeader user={auth.user} onLogout={auth.logout} />

        <main className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">meu painel</p>
              <h1 className="mt-2 text-4xl font-bold text-slate-900">Olá, {auth.user?.name}</h1>
              <p className="mt-3 max-w-2xl text-slate-600">Organize sua rotina, acompanhe suas prioridades e mantenha tudo centralizado no Planejei.</p>
            </div>
            <div className="rounded-2xl bg-slate-900 px-5 py-4 text-white shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">plano atual</p>
              <p className="mt-2 text-2xl font-bold capitalize">{plan}</p>
            </div>
          </div>

          <nav className="mb-8 overflow-x-auto rounded-[2rem] border border-slate-200 bg-white p-2 shadow-sm">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition ${activeTab === tab.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          <div>
            {activeTab === "daily" && <DailyTab />}
            {activeTab === "weekly" && <WeeklyTab />}
            {activeTab === "monthly" && <MonthlyTab />}
            {activeTab === "financial" && <FinancialTab />}
            {activeTab === "rewards" && <RewardsTab />}
          </div>
        </main>
      </div>
    </PlannerProvider>
  );
}
