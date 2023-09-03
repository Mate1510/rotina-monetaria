import nodemailer from "nodemailer";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { resetPasswordTemplate } from "@/lib/resetPasswordTemplate";

export async function POST(req: NextRequest) {
  const emailData = await req.json();
  const { email } = emailData;

  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user) {
    return NextResponse.json("User not found.", { status: 400 });
  }

  if (user.password === null) {
    return NextResponse.json("This user was created with OAuth and can't change his password.");
  }

  const token = crypto.randomBytes(32).toString("hex");

  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { userId: user.id },
  });

  if (existingToken) {
    await prisma.passwordResetToken.update({
      where: { userId: user.id },
      data: {
        token,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      },
    });
  } else {
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      },
    });
  }

  // const transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     type: "OAuth2",
  //     user: process.env.MAIL_USERNAME,
  //     pass: process.env.MAIL_PASSWORD,
  //     clientId: process.env.OAUTH_CLIENTID,
  //     clientSecret: process.env.OAUTH_CLIENT_SECRET,
  //     refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  //   },
  // } as nodemailer.TransportOptions);

  var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "0becb22f485095",
      pass: "a2ee48411287ba"
    }
  });

  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

  let mailOptions = {
    from: 'reset-password@rotinamonetaria.com',
    to: email,
    subject: "Redefinição de Senha - Rotina Monetária",
    html: resetPasswordTemplate(resetUrl),
  };

  await transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.log("Error " + error);
    } else {
      console.log("Email sent successfully");
    }
  });

  return NextResponse.json("Password reset email sent", { status: 200 });
}
