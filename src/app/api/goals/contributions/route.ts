import { prisma } from "@/lib/db";
import { Finance } from "@/finance";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userid");
  const goalId = req.nextUrl.searchParams.get("goalid");

    if (!goalId || !userId) {
        return NextResponse.json({
            error: "É necessário fornecer um goalId e um userId.",
            status: 400,
        });
    }

    try {
        const finances: Finance[] = (await prisma.financeTransaction.findMany({
            where: {
                goalId: goalId,
            },
            orderBy: {
                date: "asc",
            },
        })) as Finance[];

        return NextResponse.json(finances, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: "Falha em coletar finanças para o goalId especificado.\nErro: " + error,
            status: 500,
        });
    }
}
