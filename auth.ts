import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authorizeCredentials } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";

import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: (credentials) =>
        authorizeCredentials(
          credentials as Record<string, unknown>,
          (email) =>
            prisma.user.findUnique({
              where: { email },
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                passwordHash: true,
              },
            }),
        ),
    }),
  ],
});
