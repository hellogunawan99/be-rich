"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Target, Wallet } from "lucide-react";

interface DashboardData {
  totalBalance: number;
  totalSavings: number;
  activeGoalsCount: number;
  completedGoalsCount: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyNet: number;
  recentTransactions: any[];
  recentGoals: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">Dashboard</h1>
          <p className="text-slate-600">Welcome back to your financial overview</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <GlassCard key={i} className="p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-32" />
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getGoalCurrentAmount = (goal: any) => {
    if (goal.savingsAccountId && goal.savingsAccount) {
      return Number(goal.savingsAccount.balance);
    }
    return Number(goal.currentAmount);
  };

  const getDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-black mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back to your financial overview</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <GlassCard glow="emerald" className="p-6 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <Wallet className="size-6 text-emerald-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Total Balance</span>
          </div>
          <div className="text-4xl font-bold text-black mb-2">
            {formatCurrency(data?.totalBalance || 0)}
          </div>
          <p className="text-xs text-slate-600">Across all savings accounts</p>
        </GlassCard>

        <GlassCard hover className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <TrendingUp className="size-6 text-emerald-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Monthly Income</span>
          </div>
          <div className="text-4xl font-bold text-emerald-400 mb-2">
            {formatCurrency(data?.monthlyIncome || 0)}
          </div>
          <p className="text-xs text-slate-500">This month</p>
        </GlassCard>

        <GlassCard hover className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-red-500/20">
              <TrendingDown className="size-6 text-red-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Monthly Expenses</span>
          </div>
          <div className="text-4xl font-bold text-red-400 mb-2">
            {formatCurrency(data?.monthlyExpense || 0)}
          </div>
          <p className="text-xs text-slate-500">This month</p>
        </GlassCard>

        <GlassCard hover className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Target className="size-6 text-purple-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Active Goals</span>
          </div>
          <div className="text-4xl font-bold text-purple-400 mb-2">
            {data?.activeGoalsCount || 0}
          </div>
          <p className="text-xs text-slate-500">
            {data?.completedGoalsCount || 0} completed
          </p>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-black mb-6">Recent Transactions</h2>
          <div className="space-y-4">
            {data?.recentTransactions && data.recentTransactions.length > 0 ? (
              data.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === "income"
                        ? "bg-emerald-500/20"
                        : "bg-red-500/20"
                    }`}>
                      {transaction.type === "income" ? (
                        <TrendingUp className="size-4 text-emerald-400" />
                      ) : (
                        <TrendingDown className="size-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-black">
                        {transaction.description || "Transaction"}
                      </p>
                      <p className="text-sm text-slate-600">
                        {transaction.savingsAccount?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === "income"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(Number(transaction.amount))}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600">No recent transactions</p>
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-black mb-6">Active Goals</h2>
          <div className="space-y-4">
            {data?.recentGoals && data.recentGoals.length > 0 ? (
              data.recentGoals.map((goal) => {
                const currentAmount = getGoalCurrentAmount(goal);
                const progress = Math.min(
                  (currentAmount / Number(goal.targetAmount)) * 100,
                  100
                );
                const daysRemaining = getDaysRemaining(goal.deadline);
                const deadlineDate = new Date(goal.deadline).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
                return (
                  <div key={goal.id} className="p-4 rounded-xl bg-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-black">{goal.name}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                          <span>📅 {deadlineDate}</span>
                          <span className="font-semibold text-emerald-600 ml-2">
                            {daysRemaining > 0 ? `${daysRemaining} Days Remaining` : `${Math.abs(daysRemaining)} Days Overdue`}
                          </span>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-emerald-600">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-purple-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm font-semibold text-black">
                        {formatCurrency(currentAmount)}
                      </p>
                      <p className="text-sm text-slate-500">
                        of {formatCurrency(Number(goal.targetAmount))}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600">No active goals</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
