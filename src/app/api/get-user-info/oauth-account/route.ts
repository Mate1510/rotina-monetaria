import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userid')

  if (!userId) {
    return NextResponse.json({ message: 'Usuário inválido.', status: 400 })
  }

  try {
    const oAuthAccount = await prisma.account.findFirst({
      where: { userId },
    })

    if (!oAuthAccount) {
      return NextResponse.json({
        message: 'O usuário não tem uma conta com um provedor.',
        status: 400,
      })
    }

    if (oAuthAccount.type !== 'oauth' && oAuthAccount.provider !== 'google') {
      return NextResponse.json({
        message: 'O usuário não tem nenhuma relação com o Google API.',
        status: 400,
      })
    }

    return NextResponse.json({ userOAuth: true, status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: 'Falha em coletar dados da conta oAuth.\nErro: ' + error,
      status: 500,
    })
  }
}
