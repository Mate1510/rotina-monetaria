import { Category, CategoryInput } from '@/categories'
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
    const categories: Category[] = await prisma.category.findMany({
      where: { userId: userId, isHidden: false, },
      orderBy: {
        name: 'asc',
      },
    })
    return NextResponse.json(categories, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: 'Falha em coletar as categorias.\nErro: ' + error,
      status: 500,
    })
  }
}

export async function POST(req: Request) {
  if (!req.body) {
    return NextResponse.json({ error: 'Estão faltando dados.', status: 400 })
  }

  const categoryData: CategoryInput = await req.json()

  try {
    const category: Category = await prisma.category.create({
      data: categoryData,
    })
    return NextResponse.json(category, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: 'Falha em criar categoria.\nErro: ' + error,
      status: 500,
    })
  }
}
