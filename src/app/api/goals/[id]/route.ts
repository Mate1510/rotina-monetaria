import { GoalInput } from "@/goal";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const goalId = params.id;

        if (!goalId) {
            return NextResponse.json({ error: "ID inválido.", status: 400 });
        }

        const goalData: GoalInput = await req.json();

        const updatedGoal = await prisma.goal.update({
            where: { id: goalId },
            data: goalData,
        });
        return NextResponse.json(updatedGoal, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: "Falha em atualizar meta.\nErro: " + error,
            status: 500,
        });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const goalId = params.id;

        if (!goalId) {
            return NextResponse.json({ error: "ID inválido.", status: 400 });
        }

        await prisma.goal.delete({ where: { id: goalId } });
        return NextResponse.json({
            message: "A meta foi excluída com sucesso.",
        });
    } catch (error) {
        return NextResponse.json({
            error: "Falha em excluir meta.\nErro: " + error,
            status: 500,
        });
    }
}
