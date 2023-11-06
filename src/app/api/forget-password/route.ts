import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { resetPasswordTemplate } from '@/lib/resetPasswordTemplate'

export async function POST(req: NextRequest) {
  if (!req.body) {
    return NextResponse.json({ error: 'Estão faltando dados.', status: 400 })
  }

  const emailData = await req.json()
  const { email } = emailData

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  if (!emailRegex.test(email)) {
    return NextResponse.json({ message: 'E-mail inválido.', status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email: email } })

  if (!user) {
    return NextResponse.json({
      message:
        'Se o e-mail estiver associado a uma conta, um link de redefinição será enviado.',
      status: 200,
    })
  }

  if (user.password === null) {
    return NextResponse.json({
      message: 'Esta conta não permite alteração de senha.',
      status: 403,
    })
  }

  const token = crypto.randomBytes(32).toString('hex')

  await prisma.passwordResetToken.upsert({
    where: { userId: user.id },
    update: {
      token,
      expiresAt: new Date(Date.now() + 3600000),
    },
    create: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 3600000),
    },
  })

  //ESTE CÓDIGO É PARA ENVIAR E-MAILS A PARTIR DO GMAIL
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  } as nodemailer.TransportOptions)

  //ESTE CÓDIGO É PARA ENVIAR E-MAILS DE TESTE PARA MAILTRAP
  // let transporter = nodemailer.createTransport({
  //   host: 'sandbox.smtp.mailtrap.io',
  //   port: 2525,
  //   auth: {
  //     user: '0becb22f485095',
  //     pass: 'a2ee48411287ba',
  //   },
  // })

  const resetUrl = `https://rotina-monetaria.vercel.app/from-email/reset-password?token=${token}`

  let mailOptions = {
    from: 'contato@rotinamonetaria.com',
    to: email,
    subject: 'Redefinição de Senha - Rotina Monetária',
    html: resetPasswordTemplate(resetUrl),
  }

  try {
    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      message:
        'Se o e-mail estiver associado a uma conta, um link de redefinição será enviado.',
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({
      message: 'Erro ao enviar o e-mail. Tente novamente mais tarde.',
      status: 500,
    })
  }
}
