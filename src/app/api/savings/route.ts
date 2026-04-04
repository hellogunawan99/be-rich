import { NextResponse } from "next/server";
import { getSession } from "@/lib/getServerSession";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSavingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  balance: z.number().min(0, "Balance must be positive"),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savingsAccounts = await prisma.savingsAccount.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(savingsAccounts);
  } catch (error) {
    console.error("Error fetching savings accounts:", error);
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
    const validation = createSavingsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, balance, icon, color } = validation.data;

    const savingsAccount = await prisma.savingsAccount.create({
      data: {
        userId: session.user.id,
        name,
        balance,
        icon: icon || "wallet",
        color: color || "#10b981",
      },
    });

    return NextResponse.json(savingsAccount, { status: 201 });
  } catch (error) {
    console.error("Error creating savings account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
