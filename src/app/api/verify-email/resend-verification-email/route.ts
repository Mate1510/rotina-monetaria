import { prisma } from '@/lib/db'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'
import { emailValidationTemplate } from '@/lib/emailValidationTemplate'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  if (!emailRegex.test(email)) {
    return NextResponse.json({ message: 'E-mail inválido.', status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({
        message:
          'Se o e-mail estiver associado a uma conta, um link de verificação será reenviado.',
        status: 400,
      })
    }

    if (user.password === null) {
      return NextResponse.json({
        message: 'Esta conta não permite alteração de senha.',
        status: 403,
      })
    }

    await prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id },
    })

    const token = crypto.randomBytes(32).toString('hex')

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 3600000),
      },
    })

    var transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '0becb22f485095',
        pass: 'a2ee48411287ba',
      },
    })

    const verificationUrl = `http://localhost:3000/from-email/verify-email?token=${token}`

    let mailOptions = {
      from: 'contato@rotinamonetaria.com',
      to: email,
      subject: 'Verificação de E-mail - Rotina Monetária',
      html: emailValidationTemplate(verificationUrl),
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      message:
        'Se o e-mail estiver associado a uma conta, um link de verificação será reenviado.',
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({
      message: 'Erro interno do servidor.',
      status: 500,
    })
  }
}
