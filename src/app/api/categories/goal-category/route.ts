import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userid')

  if (!userId) {
    return NextResponse.json({
      error: 'Falha em pegar o ID do usuário.',
      status: 400,
    })
  }

  try {
    const category = await prisma.category.findFirst({
      where: {
        userId: userId,
        name: 'Meta',
        isHidden: true,
      },
    })

    if (!category) {
      return NextResponse.json({
        error: 'Categoria "Meta" não encontrada para o usuário especificado.',
        status: 404,
      })
    }

    return NextResponse.json({ categoryId: category.id }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: 'Falha em coletar a categoria "Meta".\nErro: ' + error,
      status: 500,
    })
  }
}
