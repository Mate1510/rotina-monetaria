import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userid");

  if (!userId) {
    return NextResponse.json({ error: "Failed to get user ID", status: 400 });
  }

  try {
    const categories = await prisma.category.findMany({
      where: { userId: userId },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
