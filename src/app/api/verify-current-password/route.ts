import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
  const { currentPassword, userId } = await req.json()

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user || !user.password) {
    return NextResponse.json({
      message: 'Usuário não encontrado ou não possui senha.',
      status: 404,
    })
  }

  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password)

  if (!isPasswordMatch) {
    return NextResponse.json({
      message: 'A senha atual está incorreta.',
      status: 401,
    })
  }

  return NextResponse.json(isPasswordMatch, {
    status: 200,
  })
}
