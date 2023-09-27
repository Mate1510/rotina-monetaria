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
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(recentUsers, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: `Falha em coletar usuários recentes.\nErro: ${error}`,
      status: 500,
    })
  }
}
