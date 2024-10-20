import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function getUserFromToken(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const client = await clientPromise;
    const db = client.db('video_player');
    const usersCollection = db.collection('users');

    return await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}