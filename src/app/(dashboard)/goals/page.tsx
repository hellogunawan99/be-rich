"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Target, Calendar, TrendingUp, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SavingsAccount {
  id: string;
  name: string;
  balance: string;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: string;
  currentAmount: string;
  deadline: string;
  status: string;
  icon: string;
  color: string;
  savingsAccountId: string | null;
  savingsAccount?: SavingsAccount;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    savingsAccountId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [goalsRes, savingsRes] = await Promise.all([
        fetch("/api/goals"),
        fetch("/api/savings"),
      ]);

      if (goalsRes.ok) {
        const goalsData = await goalsRes.json();
        setGoals(goalsData);
      }

      if (savingsRes.ok) {
        const savingsData = await savingsRes.json();
        setSavingsAccounts(savingsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          targetAmount: parseFloat(formData.targetAmount),
          deadline: formData.deadline,
          savingsAccountId: formData.savingsAccountId || undefined,
        }),
      });

      if (response.ok) {
        toast.success("Goal created successfully");
        setDialogOpen(false);
        setFormData({ name: "", targetAmount: "", deadline: "", savingsAccountId: "" });
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create goal");
      }
    } catch (error) {
      console.error("Error creating goal:", error);
      toast.error("Failed to create goal");
    }
  };

  const handleDelete = async () => {
    if (!goalToDelete) return;

    try {
      const response = await fetch(`/api/goals/${goalToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Goal deleted successfully");
        setDeleteDialogOpen(false);
        setGoalToDelete(null);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete goal");
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal");
    }
  };

  const openDeleteDialog = (goal: Goal) => {
    setGoalToDelete(goal);
    setDeleteDialogOpen(true);
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "active":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "overdue":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getEffectiveCurrentAmount = (goal: Goal) => {
    if (goal.savingsAccountId && goal.savingsAccount) {
      return Number(goal.savingsAccount.balance);
    }
    return Number(goal.currentAmount);
  };

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    const progress = (current / target) * 100;
    return Math.min(progress, 100);
  };

  const getDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Goals</h1>
            <p className="text-slate-600">Track your financial goals</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-24" />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">Goals</h1>
          <p className="text-slate-600">Track your financial goals</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={
            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110">
              <Plus className="mr-2 size-4" />
              Create Goal
            </Button>
          } />
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-black">Create New Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black">Goal Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Buy a Car"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-secondary border-border text-black"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetAmount" className="text-black">Target Amount</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  placeholder="10000.00"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="bg-secondary border-border text-black"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-black">Target Date</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="bg-secondary border-border text-black"
                  required
                />
              </div>
              
              {savingsAccounts.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="savingsAccountId" className="text-black">Link to Savings Account (Optional)</Label>
                  <select
                    id="savingsAccountId"
                    className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-black"
                    value={formData.savingsAccountId}
                    onChange={(e) => setFormData({ ...formData, savingsAccountId: e.target.value })}
                  >
                    <option value="">Select an account</option>
                    {savingsAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} - {formatCurrency(account.balance)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-600">
                    Link a savings account to automatically track progress based on its balance
                  </p>
                </div>
              )}
              
              <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110">
                Create Goal
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center py-16">
          <Target className="mb-4 size-16 text-slate-500" />
          <h3 className="mb-2 text-lg font-semibold text-black">No goals yet</h3>
          <p className="mb-4 text-center text-slate-600">
            Create your first financial goal to start tracking your progress
          </p>
          <Button onClick={() => setDialogOpen(true)} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110">
            <Plus className="mr-2 size-4" />
            Create Goal
          </Button>
        </GlassCard>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const currentAmount = getEffectiveCurrentAmount(goal);
            const progress = calculateProgress(currentAmount, Number(goal.targetAmount));
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isLinked = !!goal.savingsAccountId;
            
            return (
              <GlassCard key={goal.id} hover className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="rounded-full p-3"
                    style={{ backgroundColor: `${goal.color}20` }}
                  >
                    <Target className="size-6" style={{ color: goal.color }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(goal)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-black mb-2">{goal.name}</h3>
                  {goal.savingsAccount && (
                    <div className="flex items-center gap-1 text-sm text-emerald-600">
                      <TrendingUp className="size-3" />
                      <span>Linked to {goal.savingsAccount.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-semibold text-black">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: goal.color 
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm mb-3">
                  <div>
                    <p className="text-slate-600">
                      {isLinked ? "Savings Balance" : "Current"}
                    </p>
                    <p className="font-semibold text-black">
                      {formatCurrency(currentAmount)}
                    </p>
                    {isLinked && goal.savingsAccount && (
                      <p className="text-xs text-emerald-600">
                        Auto-tracked from linked account
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-slate-600">Target</p>
                    <p className="font-semibold text-black">
                      {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="size-4" />
                  <span>
                    {daysRemaining > 0
                      ? `${daysRemaining} days remaining`
                      : `${Math.abs(daysRemaining)} days overdue`}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">Delete Goal?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Are you sure you want to delete "{goalToDelete?.name}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setGoalToDelete(null)} className="bg-secondary border-border text-black">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
