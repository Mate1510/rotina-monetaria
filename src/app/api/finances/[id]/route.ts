import { FinanceInput } from '@/finance'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const financeId = params.id

    if (!financeId) {
      return NextResponse.json({ error: 'ID inválido.', status: 400 })
    }

    const financeData: FinanceInput = await req.json()

    if (financeData.date) {
      const dateObject = new Date(financeData.date)
      financeData.date = dateObject
    }

    const updatedFinance = await prisma.financeTransaction.update({
      where: { id: financeId },
      data: financeData,
    })
    return NextResponse.json(updatedFinance, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: 'Falha em atualizar finança.\nErro: ' + error,
      status: 500,
    })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const financeId = params.id

    if (!financeId) {
      return NextResponse.json({ error: 'ID inválido.', status: 400 })
    }

    const finance = await prisma.financeTransaction.findUnique({
      where: { id: financeId },
    })

    if (!finance) {
      return NextResponse.json({
        error: 'Finança não encontrada.',
        status: 404,
      });
    }

    if (finance.goalId !== null) {
      const goal = await prisma.goal.findUnique({
        where: { id: finance.goalId },
      });

      if (!goal) {
        return NextResponse.json({
          error: 'Meta associada ao aporte não encontrada.',
          status: 404,
        });
      }

      const updatedGoalValue = parseFloat(goal.currentGoalValue.toString()) - parseFloat(finance.value.toString());

      await prisma.goal.update({
        where: { id: finance.goalId },
        data: { currentGoalValue: updatedGoalValue },
      });
    }

    await prisma.financeTransaction.delete({
      where: { id: financeId },
    })
    return NextResponse.json({
      message: 'A Finança foi excluída com sucesso.',
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Falha em excluir finança.\nErro: ' + error,
      status: 500,
    })
  }
}
