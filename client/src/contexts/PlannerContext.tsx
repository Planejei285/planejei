import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  estimatedTime?: number; // em minutos
  actualTime?: number; // em minutos
  category?: string;
  dueDate?: string;
  hyperFocus?: boolean;
}

export interface DailyData {
  date: string;
  tasks: Task[];
  energy: number; // 1-5
  mood: string; // emoji ou descrição
  pomodoros: number;
  smallVictories: string[];
  notes?: string;
}

export interface WeeklyData {
  weekStart: string;
  weekEnd: string;
  tasks: Task[];
  goals: string[];
  productivity: Record<string, number>; // dia -> produtividade (0-100)
  review?: {
    whatWorked: string[];
    improvements: string[];
  };
}

export interface MonthlyData {
  month: string;
  year: number;
  tasks: Task[];
  goals: string[];
  habits: Record<string, boolean[]>; // hábito -> array de 31 dias
  events: Array<{
    date: string;
    title: string;
    type: 'deadline' | 'event' | 'important';
  }>;
}

export interface FinancialData {
  month: string;
  year: number;
  income: Array<{
    id: string;
    description: string;
    amount: number;
    date: string;
    category: string;
  }>;
  expenses: Array<{
    id: string;
    description: string;
    amount: number;
    date: string;
    category: 'fixed' | 'variable' | 'leisure' | 'studies' | 'other';
    isImpulsive?: boolean;
  }>;
  goals: Array<{
    id: string;
    description: string;
    targetAmount: number;
    currentAmount: number;
  }>;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  pointsRequired: number;
  completed: boolean;
}

export interface PlannerContextType {
  // Daily
  dailyData: DailyData | null;
  setDailyData: (data: DailyData) => void;
  
  // Weekly
  weeklyData: WeeklyData | null;
  setWeeklyData: (data: WeeklyData) => void;
  
  // Monthly
  monthlyData: MonthlyData | null;
  setMonthlyData: (data: MonthlyData) => void;
  
  // Financial
  financialData: FinancialData | null;
  setFinancialData: (data: FinancialData) => void;
  
  // Rewards
  rewards: Reward[];
  setRewards: (rewards: Reward[]) => void;
  totalPoints: number;
  setTotalPoints: (points: number) => void;
  
  // Current date
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    const savedDaily = localStorage.getItem('planejei-daily');
    const savedWeekly = localStorage.getItem('planejei-weekly');
    const savedMonthly = localStorage.getItem('planejei-monthly');
    const savedFinancial = localStorage.getItem('planejei-financial');
    const savedRewards = localStorage.getItem('planejei-rewards');
    const savedPoints = localStorage.getItem('planejei-points');

    if (savedDaily) setDailyData(JSON.parse(savedDaily));
    if (savedWeekly) setWeeklyData(JSON.parse(savedWeekly));
    if (savedMonthly) setMonthlyData(JSON.parse(savedMonthly));
    if (savedFinancial) setFinancialData(JSON.parse(savedFinancial));
    if (savedRewards) setRewards(JSON.parse(savedRewards));
    if (savedPoints) setTotalPoints(JSON.parse(savedPoints));
  }, []);

  // Salvar dados no localStorage quando mudarem
  useEffect(() => {
    if (dailyData) localStorage.setItem('planejei-daily', JSON.stringify(dailyData));
  }, [dailyData]);

  useEffect(() => {
    if (weeklyData) localStorage.setItem('planejei-weekly', JSON.stringify(weeklyData));
  }, [weeklyData]);

  useEffect(() => {
    if (monthlyData) localStorage.setItem('planejei-monthly', JSON.stringify(monthlyData));
  }, [monthlyData]);

  useEffect(() => {
    if (financialData) localStorage.setItem('planejei-financial', JSON.stringify(financialData));
  }, [financialData]);

  useEffect(() => {
    localStorage.setItem('planejei-rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('planejei-points', JSON.stringify(totalPoints));
  }, [totalPoints]);

  return (
    <PlannerContext.Provider
      value={{
        dailyData,
        setDailyData,
        weeklyData,
        setWeeklyData,
        monthlyData,
        setMonthlyData,
        financialData,
        setFinancialData,
        rewards,
        setRewards,
        totalPoints,
        setTotalPoints,
        currentDate,
        setCurrentDate,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within PlannerProvider');
  }
  return context;
}
