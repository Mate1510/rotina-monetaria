import { CategoryInput } from '@/categories'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const categoryId = params.id

    if (!categoryId) {
      return NextResponse.json({ error: 'ID inválido.', status: 400 })
    }

    const categoryData: CategoryInput = await req.json()

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: categoryData,
    })
    return NextResponse.json(updatedCategory, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: 'Falha em atualizar categoria.\nErro: ' + error,
      status: 500,
    })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const categoryId = params.id

    if (!categoryId) {
      return NextResponse.json({ error: 'ID inválido.', status: 400 })
    }

    await prisma.category.delete({ where: { id: categoryId } })
    return NextResponse.json({
      message: 'A categoria foi excluída com sucesso.',
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Falha em excluir categoria.\nErro: ' + error,
      status: 500,
    })
  }
}
