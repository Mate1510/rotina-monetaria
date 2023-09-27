import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const isAdmin = req.nextUrl.searchParams.get('isadmin')

  if (isAdmin !== 'true') {
    return NextResponse.json({
      error: 'Permissão negada.',
      status: 403,
    })
  }

  try {
    const totalUsers = await prisma.user.count()
    const activeUsers = await prisma.user.count({
      where: { status: 'ACTIVE' },
    })
    const inactiveUsers = totalUsers - activeUsers

    return NextResponse.json(
      {
        totalUsers,
        activeUsers,
        inactiveUsers,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      'Falha em coletar informações de atividade dos usuários.\nErro: ' + error,
      { status: 500 },
    )
  }
}
