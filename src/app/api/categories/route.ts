import { Category, CategoryInput } from "@/categories";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userid");

  if (!userId) {
    return NextResponse.json({ error: "Failed to get user ID", status: 400 });
  }

  try {
    const categories: Category[] = await prisma.category.findMany({
      where: { userId: userId },
      orderBy: {
        name: "asc",
      },
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

export async function POST(req: Request) {
  if (!req.body) {
    return NextResponse.json({ error: "Request body is missing", status: 500 });
  }

  const categoryInput: CategoryInput = await req.json();

  try {
    const newCategory: Category = await prisma.category.create({
      data: categoryInput,
    });
    return NextResponse.json(newCategory, { status: 200 });
  } catch (error) {
    console.error("Error creating category entry:", error);
    return NextResponse.json({
      error: "Failed to create category entry",
      status: 500,
    });
  }
}
