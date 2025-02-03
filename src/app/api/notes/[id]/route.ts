import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { Favorite } from "@/models/Favorite";
import mongoose from "mongoose";
import Note from "@/models/Note";
import { verifyToken } from "@/app/lib/jwt";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const body = await request.json();
    await connectDB();

    // Get auth token and verify user
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as { userId: string };

    const updateData: { title?: string; isFavorite?: boolean } = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.isFavorite !== undefined) updateData.isFavorite = body.isFavorite;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Update Favorites collection accordingly
    if (body.isFavorite !== undefined) {
      if (body.isFavorite) {
        await Favorite.findOneAndUpdate(
          { noteId: id, userId: decoded.userId },
          { noteId: id, userId: decoded.userId },
          { upsert: true }
        );
      } else {
        await Favorite.deleteOne({ noteId: id, userId: decoded.userId });
      }
    }

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    await connectDB();

    if (!id) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid note ID format" },
        { status: 400 }
      );
    }

    const noteId = new mongoose.Types.ObjectId(id);
    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await Favorite.deleteMany({ noteId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
