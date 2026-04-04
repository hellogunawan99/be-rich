"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Wallet, PiggyBank, Banknote, CreditCard, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SavingsAccount {
  id: string;
  name: string;
  balance: string;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

const iconOptions = [
  { name: "wallet", icon: Wallet },
  { name: "piggybank", icon: PiggyBank },
  { name: "banknote", icon: Banknote },
  { name: "creditcard", icon: CreditCard },
];

const colorOptions = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export default function SavingsPage() {
  const [accounts, setAccounts] = useState<SavingsAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<SavingsAccount | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    balance: "",
    icon: "wallet",
    color: "#10b981",
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/savings");
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Failed to load savings accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          balance: parseFloat(formData.balance),
          icon: formData.icon,
          color: formData.color,
        }),
      });

      if (response.ok) {
        toast.success("Savings account created successfully");
        setDialogOpen(false);
        setFormData({ name: "", balance: "", icon: "wallet", color: "#10b981" });
        fetchAccounts();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create account");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Failed to create account");
    }
  };

  const handleDelete = async () => {
    if (!accountToDelete) return;

    try {
      const response = await fetch(`/api/savings/${accountToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Savings account deleted successfully");
        setDeleteDialogOpen(false);
        setAccountToDelete(null);
        fetchAccounts();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
  };

  const openDeleteDialog = (account: SavingsAccount) => {
    setAccountToDelete(account);
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

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((opt) => opt.name === iconName);
    return iconOption ? iconOption.icon : Wallet;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Savings Accounts</h1>
            <p className="text-slate-600">Manage your savings accounts</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-32" />
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
          <h1 className="text-4xl font-bold text-black mb-2">Savings Accounts</h1>
          <p className="text-slate-600">Manage your savings accounts</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={
            <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110">
              <Plus className="mr-2 size-4" />
              Add Account
            </Button>
          } />
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-black">Create New Savings Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black">Account Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Emergency Fund"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-secondary border-border text-black"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="balance" className="text-black">Initial Balance</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  className="bg-secondary border-border text-black"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-black">Icon</Label>
                <div className="flex gap-2">
                  {iconOptions.map((opt) => {
                    const IconComponent = opt.icon;
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: opt.name })}
                        className={`rounded-lg border-2 p-3 transition-colors ${
                          formData.icon === opt.name
                            ? "border-emerald-500 bg-emerald-500/20"
                            : "border-border hover:border-border-hover"
                        }`}
                      >
                        <IconComponent className="size-6 text-black" />
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-black">Color</Label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`size-10 rounded-full border-2 transition-transform ${
                        formData.color === color ? "scale-110 border-white" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110">
                Create Account
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {accounts.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center py-16">
          <Wallet className="mb-4 size-16 text-slate-500" />
          <h3 className="mb-2 text-lg font-semibold text-black">No savings accounts yet</h3>
          <p className="mb-4 text-center text-slate-600">
            Create your first savings account to start tracking your finances
          </p>
          <Button onClick={() => setDialogOpen(true)} className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110">
            <Plus className="mr-2 size-4" />
            Create Account
          </Button>
        </GlassCard>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => {
            const IconComponent = getIconComponent(account.icon);
            return (
              <GlassCard key={account.id} hover className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="rounded-full p-3"
                    style={{ backgroundColor: `${account.color}20` }}
                  >
                    <IconComponent className="size-6" style={{ color: account.color }} />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteDialog(account)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">{account.name}</p>
                  <p className="text-3xl font-bold text-black mb-2" style={{ color: account.color }}>
                    {formatCurrency(account.balance)}
                  </p>
                  <p className="text-xs text-slate-500">
                    Created {new Date(account.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">Delete Savings Account?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Are you sure you want to delete "{accountToDelete?.name}"? 
              This will also delete all transactions associated with this account.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAccountToDelete(null)} className="bg-secondary border-border text-black">Cancel</AlertDialogCancel>
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
