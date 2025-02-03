import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { Favorite } from '@/models/Favorite';
import mongoose from 'mongoose';
import Note from '@/models/Note';

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await Promise.resolve(context.params);
  const body = await request.json();

  try {
    await connectDB();
    const noteId = new mongoose.Types.ObjectId(id);

    if (body.isFavorite !== undefined) {
      // Handle favorite toggle
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
    } else {
      // Handle note update
      const updatedNote = await Note.findByIdAndUpdate(
        noteId,
        { 
          $set: { 
            title: body.title,
            content: body.content 
          } 
        },
        { new: true }
      );

      if (!updatedNote) {
        return NextResponse.json(
          { error: 'Note not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(updatedNote);
    }
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