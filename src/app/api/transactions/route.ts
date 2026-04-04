import { NextResponse } from "next/server";
import { getSession } from "@/lib/getServerSession";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createTransactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().min(0, "Amount must be positive"),
  description: z.string().optional(),
  category: z.string().optional(),
  savingsAccountId: z.string().min(1, "Savings account is required"),
  date: z.string().transform((str) => new Date(str)).optional(),
});

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";
    const savingsAccountId = searchParams.get("savingsAccountId");

    const where: any = { userId: session.user.id };
    if (savingsAccountId) {
      where.savingsAccountId = savingsAccountId;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { savingsAccount: true },
      orderBy: { date: "desc" },
      take: parseInt(limit),
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = createTransactionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { type, amount, description, category, savingsAccountId, date } =
      validation.data;

    const savingsAccount = await prisma.savingsAccount.findUnique({
      where: { id: savingsAccountId, userId: session.user.id },
    });

    if (!savingsAccount) {
      return NextResponse.json(
        { error: "Savings account not found" },
        { status: 404 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        savingsAccountId,
        type,
        amount,
        description,
        category,
        date: date || new Date(),
      },
      include: { savingsAccount: true },
    });

    const balanceChange = type === "income" ? amount : -amount;
    await prisma.savingsAccount.update({
      where: { id: savingsAccountId },
      data: { balance: { increment: balanceChange } },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
