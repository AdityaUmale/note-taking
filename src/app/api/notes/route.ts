import { connectDB } from '../../lib/db';
import Note from '@/models/Note';
import { NextResponse } from 'next/server';
import { Favorite } from '@/models/Favorite';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const note = await Note.create({
      title: body.title,
      content: body.content,
      date: new Date(),
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}

// Add this GET handler alongside your existing POST handler
export async function GET() {
  try {
    await connectDB();
    // For testing, use the same temporary userID as in the PATCH route
    const userId = new mongoose.Types.ObjectId('65c0e0f00000000000000000');

    const notes = await Note.find().lean();
    const favorites = await Favorite.find({ userId }).lean();
    
    const favoriteNoteIds = favorites.map(fav => fav.noteId.toString());

    const notesWithFavorites = notes.map(note => ({
      ...note,
      id: note._id.toString(),
      isFavorite: favoriteNoteIds.includes(note._id.toString())
    }));

    return NextResponse.json(notesWithFavorites);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}