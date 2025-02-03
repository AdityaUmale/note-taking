import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { Favorite } from '@/models/Favorite';
import mongoose from 'mongoose';
import Note from '@/models/Note';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const body = await request.json();
    await connectDB();

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { $set: { title: body.title } },
      { new: true }
    );

    if (!updatedNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await Promise.resolve(context.params);

  try {
    await connectDB();
    const noteId = new mongoose.Types.ObjectId(id);

    // Delete the note
    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Also delete any associated favorites
    await Favorite.deleteMany({ noteId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}