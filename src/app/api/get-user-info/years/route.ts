import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userid')

  if (!userId) {
    return NextResponse.json({
      error: 'Usuário não autenticado ou inexistente.',
      status: 400,
    })
  }

  try {
    const minYear = await prisma.financeTransaction.aggregate({
      where: { userId },
      _min: { date: true },
    })

    const maxYear = await prisma.financeTransaction.aggregate({
      where: { userId },
      _max: { date: true },
    })

    const minYearValue = minYear._min.date
      ? new Date(minYear._min.date).getFullYear()
      : null
    const maxYearValue = maxYear._max.date
      ? new Date(maxYear._max.date).getFullYear()
      : null

    return NextResponse.json(
      { minYear: minYearValue, maxYear: maxYearValue },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({
      error: 'Falha em coletar os anos.\nErro: ' + error,
      status: 500,
    })
  }
}
