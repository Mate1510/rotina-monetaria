import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

export async function PUT(req: NextRequest) {
  const passwordData = await req.json()
  const { password, token } = passwordData

  const passwordResetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!passwordResetToken) {
    return NextResponse.json({
      message: 'Token inválido ou expirado.',
      status: 400,
    })
  }

  const now = new Date()
  const tokenExpiresAt = new Date(passwordResetToken.expiresAt)

  if (tokenExpiresAt < now) {
    return NextResponse.json({ message: 'O Token expirou.', status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: passwordResetToken.userId },
  })

  if (!user) {
    return NextResponse.json({
      message: 'Usuário não encontrado.',
      status: 400,
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  })

  await prisma.passwordResetToken.delete({
    where: { token },
  })

  return NextResponse.json({
    message: 'Senha reiniciada com sucesso.',
    status: 200,
  })
}
