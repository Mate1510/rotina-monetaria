import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required", status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found", status: 404 });
    }

    return NextResponse.json({ userId: user.id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user ID", status: 500 });
  }
}
