import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const goalId = params.id

    if (!goalId) {
      return NextResponse.json({
        error: 'ID da meta não fornecido.',
        status: 400,
      })
    }

    await prisma.financeTransaction.deleteMany({
      where: { goalId: goalId.toString() },
    })

    return NextResponse.json({
      message:
        'Todos os aportes relacionados à meta foram excluídos com sucesso.',
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Erro ao excluir aportes.',
      status: 500,
    })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const goalId = params.id
    const { goalName } = await req.json()

    await prisma.financeTransaction.updateMany({
      where: {
        goalId: goalId,
        name: { endsWith: ' - Aporte' },
      },
      data: {
        name: `${goalName} - Aporte`,
      },
    })

    return NextResponse.json({
      message: 'Aportes relacionados a meta atualizados com sucesso.',
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Erro ao atualizar a meta e os aportes relacionados.',
      status: 500,
    })
  }
}
