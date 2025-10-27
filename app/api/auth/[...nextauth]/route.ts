import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserService } from '@/database/userService';

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

        const user = await UserService.getUserByEmailAndPassword(
          credentials.email,
          credentials.password
        );
        if (!user) {
          return null;
        }

        // Return user object (will be saved to token)
        return { ...user, id: user.id };
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
        token.user = user;
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
