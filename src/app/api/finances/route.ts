import { prisma } from "@/lib/db";
import { Finance, FinanceInput } from "@/finance";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const month = Number(req.nextUrl.searchParams.get("month"));
    const year = Number(req.nextUrl.searchParams.get("year"));
    const userId = req.nextUrl.searchParams.get("userid");

    if (!userId) {
        return NextResponse.json({
            error: "Usuário não autenticado ou inexistente.",
            status: 400,
        });
    }

    let startDate: Date;
    let endDate: Date;

    if (month && year) {
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0);
    } else if (year) {
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 11, 31);
    } else if (month) {
        const currentYear = new Date().getFullYear();
        startDate = new Date(currentYear, month - 1, 1);
        endDate = new Date(currentYear, month, 0);
    } else {
        return NextResponse.json({
            error: "É necessário fornecer um mês ou um ano.",
            status: 400,
        });
    }

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
            status: 500,
        });
    }
}

export async function POST(req: Request) {
    if (!req.body) {
        return NextResponse.json({
            error: "Estão faltando dados.",
            status: 400,
        });
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
