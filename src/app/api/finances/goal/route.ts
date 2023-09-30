import { prisma } from '@/lib/db'
import { Finance } from '@/finance'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const goalId = req.nextUrl.searchParams.get('goalid')

  if (!goalId) {
    return NextResponse.json({
      error: 'É necessário fornecer uma goalId.',
      status: 400,
    })
  }

  try {
    const goal = await prisma.goal.findUnique({
      where: {
        id: goalId,
      },
      select: {
        name: true,
      },
    })

    if (!goal) {
      return NextResponse.json({
        error: `Meta com goalId ${goalId} não encontrada.`,
        status: 404,
      })
    }

    const finance: Finance = (await prisma.financeTransaction.findFirst({
      where: {
        goalId: goalId,
        name: `${goal.name} - Meta`,
      },
    })) as Finance

    if (!finance) {
      return NextResponse.json({
        error: `Finança associada à goalId ${goalId} com nome "${goal.name} - Meta" não encontrada.`,
        status: 404,
      })
    }

    return NextResponse.json(finance, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: 'Falha em coletar finança.\nErro: ' + error,
      status: 500,
    })
  }
}
