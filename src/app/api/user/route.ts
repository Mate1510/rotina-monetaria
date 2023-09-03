import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { seedCategories } from "../../../lib/seedCategories";

export async function POST(req: NextRequest) {
  if (!req.body) {
    return NextResponse.json({
      message: "Request body is missing",
      status: 400,
    });
  }

  const userData = await req.json();
  const { name, email, password } = userData;

  if (!name || !email || !password) {
    return NextResponse.json("Invalid data.", { status: 400 });
  }

  if (!email.includes("@")) {
    return NextResponse.json("Invalid e-mail.", { status: 400 });
  }

  try {
    const isUserExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isUserExist) {
      return NextResponse.json({
        error: "E-mail already exists",
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

    seedCategories(user.id);

    return NextResponse.json(user, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json("Error creating user.", { status: 500 });
  }
}
