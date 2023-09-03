import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function PUT(req: NextRequest) {
  const { password, token } = await req.json();

  const passwordResetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!passwordResetToken) {
    return NextResponse.json("Invalid or expired token", { status: 400 });
  }

  const now = new Date();
  const tokenExpiresAt = new Date(passwordResetToken.expiresAt);

  if (tokenExpiresAt < now) {
    return NextResponse.json("Token has expired", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: passwordResetToken.userId },
  });

  if (!user) {
    return NextResponse.json("User not found.", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { token },
  });

  return NextResponse.json("Password reset successful", { status: 200 });
}
