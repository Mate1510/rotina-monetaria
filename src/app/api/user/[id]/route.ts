import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = params.id

  if (!userId) {
    return NextResponse.json({ message: 'ID inválido.', status: 400 })
  }

  const userData = await req.json()

  if (!userData) {
    return NextResponse.json({
      message: 'Dados inválidos.',
      status: 400,
    })
  }

  const updateData: any = {}

  if (userData.name) {
    updateData.name = userData.name
  }

  if (userData.image) {
    updateData.image = userData.image
  }

  if (userData.password) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    updateData.password = hashedPassword
  }

  if (userData.status) {
    updateData.status = userData.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  }

  if (userData.role) {
    updateData.role = userData.role === 'ADMIN' ? 'USER' : 'ADMIN'
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: 'Falha ao atualizar usuário.\nErro: ' + error,
      status: 500,
    })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({
        message: 'ID inválido.',
        status: 400,
      })
    }

    await prisma.user.update({
      where: { id: userId },
      data: { status: 'INACTIVE' },
    })
    return NextResponse.json({
      message: 'Usuário inativado.',
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Falha em inativar usuário.\nErro: ' + error,
      status: 500,
    })
  }
}
