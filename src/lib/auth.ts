import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "text", placeholder: "Seu e-mail" },
        password: {
          label: "Password",
          type: "Password",
          placeholder: "Sua senha",
        },
      },
      async authorize(credentials, req): Promise<any> {
        const user = { email: "teste@gmail.com", password: "12345" };

        return user;
      },
    }),
  ],
  //secret: process.env.SECRET,
  debug: process.env.NODE_ENV === "development",
};
