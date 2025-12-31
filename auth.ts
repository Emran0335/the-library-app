import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      user_id: number;
      role?: string;
      profile_status: string | null;
      is_active?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    user_id?: number;
    profile_status?: string | null;
    role?: string;
    is_active?: boolean;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {
        let user = null;

        user = await prisma.users.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        } else {
          if (user.role === "staff") {
            const password_matched = await bcrypt.compare(
              credentials.password as string,
              user.password
            );

            if (!password_matched) {
              throw new Error("Password does not matched!");
            }
          } else if (user.role === "member") {
            if (user.library_card_no !== credentials.password) {
              throw new Error("Invalid library card no as password");
            }
          }
        }

        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.user_id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.profile_status = user.profile_status;
        token.is_active = user.is_active;
        token.user_id = user.user_id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name;
        session.user.profile_status = token.profile_status as string;
        session.user.is_active = token.is_active as boolean;
        session.user.user_id = token.user_id as number;
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  basePath: "/auth",

  debug: true,
});
