import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { Favorite } from '@/models/Favorite';
import mongoose from 'mongoose';

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await Promise.resolve(context.params);

  try {
    await connectDB();
    const body = await request.json();
    
    // Create a valid ObjectId for the note
    const noteId = new mongoose.Types.ObjectId(id);
    // For testing, create a temporary user ID (replace this with actual user ID from auth)
    const userId = new mongoose.Types.ObjectId('65c0e0f00000000000000000');

    if (body.isFavorite) {
      await Favorite.create({
        userId,
        noteId
      });
    } else {
      await Favorite.findOneAndDelete({
        userId,
        noteId
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'Note already in favorites' },
        { status: 400 }
      );
    }
    
    console.error('Error updating favorite:', error);
    return NextResponse.json(
      { error: 'Failed to update favorite status' },
      { status: 500 }
    );
  }
}