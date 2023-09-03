import { FinanceInput } from "@/finance";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "Invalid ID provided", status: 500 });
    }

    const financeInput: FinanceInput = await req.json();

    if (financeInput.date) {
      const dateObject = new Date(financeInput.date);
      financeInput.date = dateObject;
    }

    const updatedFinance = await prisma.financeTransaction.update({
      where: { id: id },
      data: financeInput,
    });
    return NextResponse.json(updatedFinance);
  } catch (error) {
    return NextResponse.json({
      error: "Failed to update finance entry ",
      status: 500,
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "Invalid ID provided", status: 500 });
    }

    await prisma.financeTransaction.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: "Finance entry deleted successfuly" });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to delete finance entry",
      status: 500,
    });
  }
}
