import { connectDB } from '../../lib/db';
import Note from '@/models/Note';
import { NextResponse } from 'next/server';
import { Favorite } from '@/models/Favorite';
import mongoose from 'mongoose';

// Define interfaces for the lean document types
interface LeanNote {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  date: Date;
}

interface NoteWithFavorite extends Omit<LeanNote, '_id'> {
  _id: mongoose.Types.ObjectId;
  id: string;
  isFavorite: boolean;
}

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

export async function GET() {
  try {
    await connectDB();
    const userId = new mongoose.Types.ObjectId('65c0e0f00000000000000000');
    const notes = await Note.find().lean<LeanNote[]>();
    const favorites = await Favorite.find({ userId }).lean();
    
    const favoriteNoteIds = favorites.map(fav => fav.noteId.toString());
    const notesWithFavorites: NoteWithFavorite[] = notes.map((note) => ({
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