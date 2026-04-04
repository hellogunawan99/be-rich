"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: string;
  amount: string;
  description: string | null;
  category: string | null;
  date: string;
  savingsAccount: {
    id: string;
    name: string;
  };
}

interface SavingsAccount {
  id: string;
  name: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "income",
    amount: "",
    description: "",
    category: "",
    savingsAccountId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, savingsRes] = await Promise.all([
        fetch("/api/transactions?limit=50"),
        fetch("/api/savings"),
      ]);

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData);
      }

      if (savingsRes.ok) {
        const savingsData = await savingsRes.json();
        setSavingsAccounts(savingsData);
        if (savingsData.length > 0) {
          setFormData((prev) => ({ ...prev, savingsAccountId: savingsData[0].id }));
        }
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
    
    if (!formData.savingsAccountId) {
      toast.error("Please select a savings account");
      return;
    }

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          amount: parseFloat(formData.amount),
          description: formData.description || undefined,
          category: formData.category || undefined,
          savingsAccountId: formData.savingsAccountId,
        }),
      });

      if (response.ok) {
        toast.success("Transaction added successfully");
        setDialogOpen(false);
        setFormData({
          type: "income",
          amount: "",
          description: "",
          category: "",
          savingsAccountId: savingsAccounts[0]?.id || "",
        });
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add transaction");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Transaction deleted successfully");
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    }
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
            <p className="text-slate-600">View and manage your transactions</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
          <p className="text-slate-600">View and manage your transactions</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={
            <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={savingsAccounts.length === 0}>
              <Plus className="mr-2 size-4" />
              Add Transaction
            </Button>
          } />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.type === "income" ? "default" : "outline"}
                    className={`flex-1 ${
                      formData.type === "income"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : ""
                    }`}
                    onClick={() => setFormData({ ...formData, type: "income" })}
                  >
                    <TrendingUp className="mr-2 size-4" />
                    Income
                  </Button>
                  <Button
                    type="button"
                    variant={formData.type === "expense" ? "default" : "outline"}
                    className={`flex-1 ${
                      formData.type === "expense"
                        ? "bg-red-600 hover:bg-red-700"
                        : ""
                    }`}
                    onClick={() => setFormData({ ...formData, type: "expense" })}
                  >
                    <TrendingDown className="mr-2 size-4" />
                    Expense
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="e.g., Monthly salary"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category (Optional)</Label>
                <Input
                  id="category"
                  placeholder="e.g., Salary, Food, Transport"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="savingsAccountId">Savings Account</Label>
                <select
                  id="savingsAccountId"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={formData.savingsAccountId}
                  onChange={(e) => setFormData({ ...formData, savingsAccountId: e.target.value })}
                  required
                >
                  <option value="">Select an account</option>
                  {savingsAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                Add Transaction
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {savingsAccounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <TrendingUp className="mb-4 size-16 text-slate-300" />
            <h3 className="mb-2 text-lg font-semibold text-slate-900">No savings accounts</h3>
            <p className="mb-4 text-center text-slate-600">
              You need to create a savings account first before adding transactions
            </p>
          </CardContent>
        </Card>
      ) : transactions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <TrendingUp className="mb-4 size-16 text-slate-300" />
            <h3 className="mb-2 text-lg font-semibold text-slate-900">No transactions yet</h3>
            <p className="mb-4 text-center text-slate-600">
              Add your first transaction to start tracking your finances
            </p>
            <Button onClick={() => setDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 size-4" />
              Add Transaction
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{transaction.description || "-"}</TableCell>
                    <TableCell>
                      {transaction.category ? (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">
                          {transaction.category}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{transaction.savingsAccount?.name || "-"}</TableCell>
                    <TableCell className={`text-right font-semibold ${
                      transaction.type === "income" ? "text-emerald-600" : "text-red-600"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
