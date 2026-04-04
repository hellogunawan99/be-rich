import { NextResponse } from "next/server";
import { getSession } from "@/lib/getServerSession";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSavingsSchema = z.object({
  name: z.string().min(1).optional(),
  balance: z.number().min(0).optional(),
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

    const savingsAccount = await prisma.savingsAccount.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!savingsAccount) {
      return NextResponse.json(
        { error: "Savings account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(savingsAccount);
  } catch (error) {
    console.error("Error fetching savings account:", error);
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
    const validation = updateSavingsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const savingsAccount = await prisma.savingsAccount.update({
      where: { id, userId: session.user.id },
      data: validation.data,
    });

    return NextResponse.json(savingsAccount);
  } catch (error) {
    console.error("Error updating savings account:", error);
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

    await prisma.savingsAccount.delete({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ message: "Savings account deleted" });
  } catch (error) {
    console.error("Error deleting savings account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
