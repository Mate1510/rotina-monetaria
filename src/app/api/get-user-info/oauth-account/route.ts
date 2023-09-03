import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userid");

  if (!userId) {
    return NextResponse.json("User invalid!", { status: 400 });
  }

  try {
    const oAuthAccount = await prisma.account.findFirst({
      where: { userId },
    });

    if (!oAuthAccount) {
      return NextResponse.json("User doesn't have an Account Provider.", {
        status: 400,
      });
    }

    if (oAuthAccount.type !== "oauth" && oAuthAccount.provider !== "google") {
      return NextResponse.json(
        "The user don't have any bond with oAuth Google API.",
        { status: 400 }
      );
    }

    return NextResponse.json({ userOAuth: true });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to fetch oAuth Account.",
      status: 500,
    });
  }
}
