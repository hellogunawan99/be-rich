import { NextResponse } from "next/server";
import { getSession } from "@/lib/getServerSession";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createGoalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  targetAmount: z.number().min(0, "Target amount must be positive"),
  deadline: z.string().transform((str) => new Date(str)),
  savingsAccountId: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id },
      include: { savingsAccount: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
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
    const validation = createGoalSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, targetAmount, deadline, savingsAccountId, icon, color } =
      validation.data;

    const goal = await prisma.goal.create({
      data: {
        userId: session.user.id,
        name,
        targetAmount,
        deadline,
        savingsAccountId: savingsAccountId || null,
        icon: icon || "target",
        color: color || "#f59e0b",
      },
      include: { savingsAccount: true },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
