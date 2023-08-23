import { prisma } from "@/lib/db";
import { Finance, FinanceInput } from "@/finance";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const month = Number(req.nextUrl.searchParams.get("month"));
  const year = Number(req.nextUrl.searchParams.get("year"));
  const userId = req.nextUrl.searchParams.get("userid");

  if (!month || !year) {
    return NextResponse.json({
      error: "Month and year are required",
      status: 500,
    });
  }

  if (!userId) {
    return NextResponse.json({ error: "USer not authenticated", status: 500 });
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  try {
    const finances: Finance[] = (await prisma.financeTransaction.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    })) as Finance[];
    return NextResponse.json(finances);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch finances" });
  }
}

export async function POST(req: Request) {
  if (!req.body) {
    return NextResponse.json({ error: "Request body is missing" });
  }

  const financeInput: FinanceInput = await req.json();

  if (financeInput.date) {
    const dateObject = new Date(financeInput.date);
    financeInput.date = dateObject;
  }

  try {
    const newFinance: Finance = (await prisma.financeTransaction.create({
      data: financeInput,
    })) as Finance;

    return NextResponse.json(newFinance, {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating finance entry:", error);
    return NextResponse.json({
      error: "Failed to create finance entry",
      status: 500,
    });
  }
}
