import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/prisma/db';
import bcrypt from 'bcryptjs';
export const runtime = "nodejs";
const authOptions: NextAuthOptions = {
  debug: true,

  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user?.password || ''
        );

        if (!user || !isValidPassword) {
          return null;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, created_at, updated_at, ...userWithoutPassword } =
          user;

        // Return user object (will be saved to token)
        return {
          ...userWithoutPassword,
          id: userWithoutPassword.id.toString(),
        };
      },
    }),
  ],

  pages: {
    signIn: '/auth/login',
  },

  session: {
    strategy: 'jwt', // use JWT instead of database
    maxAge: Number(process.env.NEXTAUTH_SESSION_EXPIRED) * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      // On login, merge user data into token
      if (user) {
        token.user = user as {
          id: string;
          role: string;
          email: string;
          full_name: string;
          phone: string | null;
          birth: string | null;
          domicile: string | null;
          country: string | null;
          country_code: string | null;
          gender: string | null;
          linkedin: string | null;
        };
      }
      return token;
    },

    async session({ session, token }) {
      // Make user data available in session
      session.user = token.user as typeof session.user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
