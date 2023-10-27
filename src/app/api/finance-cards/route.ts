import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const month = Number(req.nextUrl.searchParams.get('month'))
  const year = Number(req.nextUrl.searchParams.get('year'))
  const userId = req.nextUrl.searchParams.get('userid')

  console.log(month, year, userId)

  if (!userId) {
    return NextResponse.json({
      error: 'Usuário não autenticado ou inexistente.',
      status: 400,
    })
  }

  if (!month || !year) {
    return NextResponse.json({
      error: 'É necessário fornecer um mês e um ano.',
      status: 400,
    })
  }

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  try {
    const finances = await prisma.financeTransaction.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        type: true,
        value: true,
      },
    })

    let totalIncome = 0
    let totalExpense = 0

    finances.forEach(finance => {
      if (finance.type === 'INCOME') {
        totalIncome += Number(finance.value)
      } else {
        totalExpense += Number(finance.value)
      }
    })

    return NextResponse.json({
      totalIncome,
      totalExpense,
      total: totalIncome - totalExpense,
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Falha em coletar resumo financeiro.\nErro: ' + error,
      status: 500,
    })
  }
}
