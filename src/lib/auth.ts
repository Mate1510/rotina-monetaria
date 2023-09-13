import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { seedCategories } from "./seedCategories";

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
                email: { label: "E-mail", type: "text", placeholder: "E-mail" },
                password: {
                    label: "Password",
                    type: "Password",
                    placeholder: "Senha",
                },
                name: { label: "Name", type: "text", placeholder: "Nome" },
            },
            async authorize(credentials, req): Promise<any> {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("No credentials passed");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || !user.password) {
                    throw new Error("No user found with this credentials");
                }

                if (user.status == "INACTIVE") {
                    throw new Error("The user is inactive!");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                const existingUser = await prisma.user.findUnique({
                    where: {
                        email: user.email!,
                    },
                });

                if (existingUser?.lastEntry === null) {
                     await seedCategories(existingUser.id);
                }

                await prisma.user.update({
                    where: { id: existingUser?.id },
                    data: { lastEntry: new Date() },
                });

                return {
                    ...token,
                    userId: user.id,
                };
            }

            return token;
        },
        async session({ session, token, user }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    userId: token.userId,
                },
            };
        },
    },
    secret: process.env.SECRET,
    session: {
        strategy: "jwt",
    },
    debug: process.env.NODE_ENV === "development",
    pages: {
        signIn: "/login",
    },
};
