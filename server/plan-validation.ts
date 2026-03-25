import { PLAN_LIMITS } from './stripe-products';

export type PlanType = 'free' | 'basic' | 'premium';

export interface PlanLimits {
  maxTasksPerMonth: number;
  hasReports: boolean;
  hasExport: boolean;
  hasAdvancedFeatures: boolean;
}

export function getPlanLimits(plan: PlanType): PlanLimits {
  return PLAN_LIMITS[plan];
}

export function canAddTask(plan: PlanType, currentTaskCount: number): boolean {
  const limits = getPlanLimits(plan);
  return currentTaskCount < limits.maxTasksPerMonth;
}

export function getTasksRemaining(plan: PlanType, currentTaskCount: number): number {
  const limits = getPlanLimits(plan);
  return Math.max(0, limits.maxTasksPerMonth - currentTaskCount);
}

export function isTaskLimitReached(plan: PlanType, currentTaskCount: number): boolean {
  const limits = getPlanLimits(plan);
  return currentTaskCount >= limits.maxTasksPerMonth;
}

export function canExportData(plan: PlanType): boolean {
  return getPlanLimits(plan).hasExport;
}

export function canViewReports(plan: PlanType): boolean {
  return getPlanLimits(plan).hasReports;
}

export function canUseAdvancedFeatures(plan: PlanType): boolean {
  return getPlanLimits(plan).hasAdvancedFeatures;
}
