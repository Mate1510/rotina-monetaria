import { FinanceInput } from "@/finance";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const transactionId = await prisma.financeTransaction.findFirst({
    where: { id },
  });

  if (!id || typeof id !== "string" || !transactionId) {
    return NextResponse.json({ error: "Invalid ID provided", status: 500 });
  }

  const financeInput: FinanceInput = await req.json();

  if (financeInput.date) {
    const dateObject = new Date(financeInput.date);
    financeInput.date = dateObject;
  }

  try {
    const updatedFinance = await prisma.financeTransaction.update({
      where: transactionId,
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
  const id = params.id;
  const transactionId = await prisma.financeTransaction.findFirst({
    where: { id },
  });

  if (!id || typeof id !== "string" || !transactionId) {
    return NextResponse.json({ error: "Invalid ID provided", status: 500 });
  }

  try {
    await prisma.financeTransaction.delete({
      where: transactionId,
    });
    return NextResponse.json({ message: "Finance entry deleted successfuly" });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to delete finance entry",
      status: 500,
    });
  }
}
