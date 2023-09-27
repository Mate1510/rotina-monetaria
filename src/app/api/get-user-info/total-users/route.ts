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
    return NextResponse.json({ totalUsers }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: 'Falha em contar usuários.\nErro: ' + error,
      status: 500,
    })
  }
}
