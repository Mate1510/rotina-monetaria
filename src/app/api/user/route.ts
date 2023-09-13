import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  if (!req.body) {
    return NextResponse.json({
      message: "Estão faltando dados.",
      status: 400,
    });
  }

  const userData = await req.json();
  const { name, email, password } = userData;

  if (!name || !email || !password) {
    return NextResponse.json({ message: "Dados inválidos.", status: 400 });
  }

  if (!email.includes("@")) {
    return NextResponse.json({ message: "E-mail inválido.", status: 400 });
  }

  try {
    const isUserExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isUserExist) {
      return NextResponse.json({
        error: "Usuário já existe.",
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Falha ao criar usuário.\nError: " + error,
      status: 500,
    });
  }
}
