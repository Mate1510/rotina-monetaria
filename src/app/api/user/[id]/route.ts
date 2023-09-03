import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  if (!userId) {
    return NextResponse.json({ message: "Invalid ID provided!", status: 400 });
  }

  const userData = await req.json();

  if (!userData) {
    return NextResponse.json({
      message: "Invalid user data provided!",
      status: 400,
    });
  }

  const updateData: any = {};

  if (userData.name) {
    updateData.name = userData.name;
  }

  if (userData.image) {
    updateData.image = userData.image;
  }

  if (userData.password) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    updateData.password = hashedPassword;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error, status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json({
        message: "Invalid ID provided!",
        status: 400,
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { status: "INACTIVE" },
    });
    return NextResponse.json({ message: "User Inactivated!", status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to inactivate user.",
      status: 500,
    });
  }
}
