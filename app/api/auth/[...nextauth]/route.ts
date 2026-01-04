import NextAuth from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';

interface JWTPayload {
  id: string;
  profileId?: string;
}

interface SessionPayload {
  user: {
    id: string;
    email?: string;
    name?: string;
    profileId?: string;
  };
}

interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  profileId?: string;
}
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please provide email and password');
                }

                await connectDB();

                const user = await User.findOne({ email: credentials.email.toLowerCase() });

                if (!user) {
                    throw new Error('No user found with this email');
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    profileId: user.profileId?.toString(),
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }: { token: JWTPayload; user: AuthUser | undefined }) {
            if (user) {
                token.id = user.id;
                token.profileId = user.profileId;
            }
            return token;
        },
        async session({ session, token }: { session: SessionPayload; token: JWTPayload }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.profileId = token.profileId;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handler = (NextAuth as any)(authOptions);

export { handler as GET, handler as POST };
