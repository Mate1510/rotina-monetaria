import { Goal } from "@/goal";
import { GoalInput } from "@/goal";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userid");

    if (!userId) {
        return NextResponse.json({
            error: "Falha em pegar o ID do usuário.",
            status: 400,
        });
    }

    try {
        const goals: Goal[] = await prisma.goal.findMany({
            where: { userId: userId },
            orderBy: {
                createdAt: "asc",
            },
        });
        return NextResponse.json(goals, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: "Falha em coletar as metas.\nErro: " + error,
            status: 500,
        });
    }
}

export async function POST(req: NextRequest) {
    if (!req.body) {
        return NextResponse.json({
            error: "Estão faltando dados.",
            status: 400,
        });
    }

    const goalData: GoalInput = await req.json();

    try {
        const goal: Goal = await prisma.goal.create({
            data: goalData,
        });
        return NextResponse.json(goal, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: "Falha em criar meta.\nErro: " + error,
            status: 500,
        });
    }
}
