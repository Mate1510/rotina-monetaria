import { prisma } from "@/lib/db";
import { Finance, FinanceInput } from "@/finance";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const month = Number(req.nextUrl.searchParams.get("month"));
  const year = Number(req.nextUrl.searchParams.get("year"));
  const userId = req.nextUrl.searchParams.get("userid");

  if (!month || !year) {
    return NextResponse.json({
      error: "Mês e ano são obrigatórios.",
      status: 400,
    });
  }

  if (!userId) {
    return NextResponse.json({
      error: "Usuário não autenticado ou inexistente.",
      status: 400,
    });
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
    return NextResponse.json(finances, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "Falha em coletar finanças.\nErro: " + error,
    });
  }
}

export async function POST(req: Request) {
  if (!req.body) {
    return NextResponse.json({ error: "Estão faltando dados.", status: 400 });
  }

  const financeData: FinanceInput = await req.json();

  if (financeData.date) {
    const dateObject = new Date(financeData.date);
    financeData.date = dateObject;
  }

  try {
    const finance: Finance = (await prisma.financeTransaction.create({
      data: financeData,
    })) as Finance;

    return NextResponse.json(finance, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "Falha em criar finança.\nErro: " + error,
      status: 500,
    });
  }
}
