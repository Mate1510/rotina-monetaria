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

  const user = await prisma.user.findUnique({ where: { email: email } })

  if (!user) {
    return NextResponse.json('Usuário não encontrado.', { status: 400 })
  }

  if (user.password === null) {
    return NextResponse.json({
      message:
        'Este usuário foi criado com oAuth e não pode alterar sua senha.',
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

  /* ESTE CÓDIGO É PARA ENVIAR E-MAILS A PARTIR DO GMAIL
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      },
    } as nodemailer.TransportOptions);*/

  var transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '0becb22f485095',
      pass: 'a2ee48411287ba',
    },
  })

  const resetUrl = `http://localhost:3000/reset-password?token=${token}`

  let mailOptions = {
    from: 'reset-password@rotinamonetaria.com',
    to: email,
    subject: 'Redefinição de Senha - Rotina Monetária',
    html: resetPasswordTemplate(resetUrl),
  }

  await transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.log('Erro: ' + error)
    } else {
      console.log('E-mail enviado com sucesso.')
    }
  })

  return NextResponse.json(
    'E-mail de redefinição de senha enviado com sucesso.',
    { status: 200 },
  )
}
