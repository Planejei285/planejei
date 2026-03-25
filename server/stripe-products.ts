/**
 * Stripe Products Configuration for Planejei
 * 
 * Plano Básico: R$ 20/mês
 * Plano Premium: R$ 35/mês
 */

export const STRIPE_PRODUCTS = {
  basic: {
    name: 'Planejei Básico',
    description: 'Até 100 tarefas por mês, sincronização básica',
    price: 2000, // R$ 20.00 em centavos
    currency: 'brl',
    interval: 'month' as const,
    plan: 'basic' as const,
  },
  premium: {
    name: 'Planejei Premium',
    description: 'Tarefas ilimitadas, relatórios avançados, exportar PDF',
    price: 3500, // R$ 35.00 em centavos
    currency: 'brl',
    interval: 'month' as const,
    plan: 'premium' as const,
  },
};

export const PLAN_LIMITS = {
  free: {
    maxTasksPerMonth: 20,
    hasReports: false,
    hasExport: false,
    hasAdvancedFeatures: false,
  },
  basic: {
    maxTasksPerMonth: 100,
    hasReports: false,
    hasExport: false,
    hasAdvancedFeatures: false,
  },
  premium: {
    maxTasksPerMonth: Infinity,
    hasReports: true,
    hasExport: true,
    hasAdvancedFeatures: true,
  },
};
