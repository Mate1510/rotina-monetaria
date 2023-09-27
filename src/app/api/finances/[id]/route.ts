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
