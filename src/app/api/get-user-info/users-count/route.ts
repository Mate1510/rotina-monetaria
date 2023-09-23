import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const isAdmin = req.nextUrl.searchParams.get("isadmin");

    if (isAdmin !== "true") {
      return NextResponse.json({
        error: "Permissão negada.",
        status: 403,
      });
    }

    try {
      const users = await prisma.user.findMany({
        select: {
          _count: {
            select: {
              transactions: true,
              categories: true,
              goals: true,
            },
          },
        },
      });
      return NextResponse.json(users, { status: 200 });
    } catch (error) {
      return NextResponse.json({
        error: `Falha em coletar a contagem de usuários.\nErro: ${error}`,
        status: 500,
      });
    }
  }
