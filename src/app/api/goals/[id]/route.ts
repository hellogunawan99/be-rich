import { NextResponse } from "next/server";
import { getSession } from "@/lib/getServerSession";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateGoalSchema = z.object({
  name: z.string().min(1).optional(),
  targetAmount: z.number().min(0).optional(),
  currentAmount: z.number().min(0).optional(),
  deadline: z.string().transform((str) => new Date(str)).optional(),
  status: z.enum(["active", "completed", "overdue"]).optional(),
  savingsAccountId: z.string().nullable().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const goal = await prisma.goal.findUnique({
      where: { id, userId: session.user.id },
      include: { savingsAccount: true },
    });

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Error fetching goal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = updateGoalSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.update({
      where: { id, userId: session.user.id },
      data: validation.data,
      include: { savingsAccount: true },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Error updating goal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.goal.delete({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ message: "Goal deleted" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
