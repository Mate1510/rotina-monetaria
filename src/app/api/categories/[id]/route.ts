import { CategoryInput } from "@/categories";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "Invalid ID provided.", status: 500 });
    }

    const categoryInput: CategoryInput = await req.json();

    const updatedCategory = await prisma.category.update({
      where: { id: id },
      data: categoryInput,
    });
    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json({
      error: "Failed to update category entry",
      status: 500,
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "Invalid ID provided", status: 500 });
    }

    await prisma.category.delete({ where: { id: id } });
    return NextResponse.json({
      message: "Category entry deleted successfuly.",
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to delete category entry",
      status: 500,
    });
  }
}
