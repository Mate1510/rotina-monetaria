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
    const usersLastEntry = await prisma.user.findMany({
      select: {
        lastEntry: true,
      },
      orderBy: {
        lastEntry: 'desc',
      },
    })
    return NextResponse.json(usersLastEntry, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: `Falha em coletar usuários recentes.\nErro: ${error}`,
      status: 500,
    })
  }
}
