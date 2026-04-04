import { NextResponse } from "next/server";
import { getSession } from "@/lib/getServerSession";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const savingsAccounts = await prisma.savingsAccount.findMany({
      where: { userId },
    });

    const totalBalance = savingsAccounts.reduce(
      (sum: number, account: { balance: any }) => sum + Number(account.balance),
      0
    );

    const goals = await prisma.goal.findMany({
      where: { userId },
      include: { savingsAccount: true },
    });

    const activeGoals = goals.filter((goal: { status: string }) => goal.status === "active");
    const completedGoals = goals.filter((goal: { status: string }) => goal.status === "completed");

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startOfMonth },
      },
    });

    const monthlyIncome = monthlyTransactions
      .filter((t: { type: string }) => t.type === "income")
      .reduce((sum: number, t: { amount: any }) => sum + Number(t.amount), 0);

    const monthlyExpense = monthlyTransactions
      .filter((t: { type: string }) => t.type === "expense")
      .reduce((sum: number, t: { amount: any }) => sum + Number(t.amount), 0);

    const recentTransactions = await prisma.transaction.findMany({
      where: { userId },
      include: { savingsAccount: true },
      orderBy: { date: "desc" },
      take: 5,
    });

    const recentGoals = goals
      .filter((goal: { status: string }) => goal.status === "active")
      .slice(0, 3);

    return NextResponse.json({
      totalBalance,
      totalSavings: totalBalance,
      activeGoalsCount: activeGoals.length,
      completedGoalsCount: completedGoals.length,
      monthlyIncome,
      monthlyExpense,
      monthlyNet: monthlyIncome - monthlyExpense,
      recentTransactions,
      recentGoals,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
