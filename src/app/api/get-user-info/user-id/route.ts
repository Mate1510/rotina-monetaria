import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "E-mail é obrigatório.", status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        error: "Usuário não encontrado.",
        status: 400,
      });
    }

    return NextResponse.json({ userId: user.id });
  } catch (error) {
    return NextResponse.json({
      error: "Falha em coletar dados do usuário.",
      status: 500,
    });
  }
}
