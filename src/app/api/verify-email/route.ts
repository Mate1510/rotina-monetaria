import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest) {
  try {
    const verificationData = await req.json()
    const { token } = verificationData

    const emailVerificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
    })

    if (!emailVerificationToken) {
      return NextResponse.json({
        message: 'Token inválido ou expirado.',
        status: 400,
      })
    }

    const now = new Date()
    const tokenExpiresAt = new Date(emailVerificationToken.expiresAt)

    if (tokenExpiresAt < now) {
      return NextResponse.json({ message: 'O Token expirou.', status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: emailVerificationToken.userId },
    })

    if (!user) {
      return NextResponse.json({
        message: 'Usuário não encontrado.',
        status: 400,
      })
    }

    if (user.emailVerified) {
      return NextResponse.json({
        message: 'E-mail já foi verificado.',
        status: 400,
      })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    })

    await prisma.emailVerificationToken.delete({
      where: { token },
    })

    return NextResponse.json({
      message: 'E-mail verificado com sucesso.',
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({
      message: 'Erro interno do servidor.',
      status: 500,
    })
  }
}
