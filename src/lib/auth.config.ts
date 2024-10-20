// src/lib/auth.config.ts
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export const authConfig: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('Missing credentials');
        }
      
        const client = await clientPromise;
        const db = client.db('video_player');
        const user = await db.collection('users').findOne({ email: credentials.email });
      
        if (!user) {
          throw new Error('No user found with the email');
        }
      
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
      
        if (!isValidPassword) {
          throw new Error('Incorrect password');
        }
      
        return { id: user._id.toString(), name: user.name, email: user.email };
      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
  },
  secret: process.env.NEXTAUTH_SECRET,
};