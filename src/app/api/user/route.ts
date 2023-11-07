import { prisma } from '@/lib/db'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { emailValidationTemplate } from '@/lib/emailValidationTemplate'

export async function GET(req: NextRequest) {
  const isAdmin = req.nextUrl.searchParams.get('isadmin')
  const currentPage = req.nextUrl.searchParams.get('page') || '1'

  if (isAdmin !== 'true') {
    return NextResponse.json({
      error: 'Permissão negada.',
      status: 403,
    })
  }

  try {
    const page = parseInt(currentPage)
    const pageSize = 15
    const skip = (page - 1) * pageSize

    const users = await prisma.user.findMany({
      skip,
      take: pageSize,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: 'Falha em coletar usuários.\nErro: ' + error,
      status: 500,
    })
  }
}

export async function POST(req: NextRequest) {
  if (!req.body) {
    return NextResponse.json({
      error: 'Estão faltando dados.',
      status: 400,
    })
  }

  const userData = await req.json()
  const { name, email, password } = userData

  if (!name || !email || !password) {
    return NextResponse.json({
      error: 'Todos os dados são obrigatórios! 😉',
      status: 400,
    })
  }

  if (!email.includes('@')) {
    return NextResponse.json({ error: 'E-mail inválido! 😔', status: 400 })
  }

  try {
    const isUserExist = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (isUserExist) {
      return NextResponse.json({
        error: 'Não foi possível concluir a criação deste usuário! 😔',
        status: 400,
      })
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

    if (!passwordRegex.test(password)) {
      return NextResponse.json({
        error:
          'A senha deve ter pelo menos: 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial! 😔',
        status: 400,
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    const token = crypto.randomBytes(32).toString('hex')

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 3600000), // Expira em 1 hora
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
    // var transporter = nodemailer.createTransport({
    //   host: 'sandbox.smtp.mailtrap.io',
    //   port: 2525,
    //   auth: {
    //     user: '0becb22f485095',
    //     pass: 'a2ee48411287ba',
    //   },
    // })

    const verificationUrl = `https://rotina-monetaria.vercel.app/from-email/verify-email?token=${token}`

    let mailOptions = {
      from: 'mateusabreucn@gmail.com',
      to: email,
      subject: 'Verificação de E-mail - Rotina Monetária',
      html: emailValidationTemplate(verificationUrl),
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      message: 'Usuário criado com sucesso!',
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Falha ao criar usuário.\nError: ' + error,
      status: 500,
    })
  }
}
