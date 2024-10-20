import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

// Define auth options separately and type it properly
const authConfig: AuthOptions = {
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

// Create the handler
const handler = NextAuth(authConfig);

// Export the handler functions
export { handler as GET, handler as POST };

// If you need to use the auth options elsewhere in your application,
// create a separate config file (e.g., auth.config.ts) and export it from there