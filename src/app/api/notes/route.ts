import { connectDB } from '../../lib/db';
import Note from '@/models/Note';
import { NextResponse } from 'next/server';
import { Favorite } from '@/models/Favorite';
import mongoose from 'mongoose';
import { verifyToken } from '@/app/lib/jwt';

// Define interfaces for the types
interface LeanNote {
    _id: mongoose.Types.ObjectId;
    title: string;
    content: string;
    date: Date;
    userId: string;
}

interface NoteWithFavorite extends Omit<LeanNote, '_id'> {
    _id: mongoose.Types.ObjectId;
    id: string;
    isFavorite: boolean;
}

interface NoteInput {
    title: string;
    content: string;
}

interface JWTPayload {
    userId: string;
    // Add other JWT payload fields if needed
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const authHeader = req.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token) as JWTPayload;

        if (!decoded?.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const data = await req.json() as NoteInput;
        
        const note = await Note.create({
            title: data.title,
            content: data.content,
            userId: decoded.userId,
            date: new Date()
        });

        return NextResponse.json(note);
    } catch (error) {
        console.error('Error creating note:', error);
        return NextResponse.json(
            { error: 'Failed to create note' },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const authHeader = req.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token) as JWTPayload;

        if (!decoded?.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const notes = await Note.find({ userId: decoded.userId })
            .sort({ date: -1 })
            .lean<LeanNote[]>();

        const favorites = await Favorite.find({ 
            userId: decoded.userId 
        }).lean();

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

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const authHeader = req.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token) as JWTPayload;

        if (!decoded?.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const url = new URL(req.url);
        const noteId = url.searchParams.get('id');

        if (!noteId) {
            return NextResponse.json(
                { error: 'Note ID is required' },
                { status: 400 }
            );
        }

        const note = await Note.findOneAndDelete({
            _id: noteId,
            userId: decoded.userId
        });

        if (!note) {
            return NextResponse.json(
                { error: 'Note not found' },
                { status: 404 }
            );
        }

        // Also delete any favorites associated with this note
        await Favorite.deleteMany({ noteId });

        return NextResponse.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        return NextResponse.json(
            { error: 'Failed to delete note' },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB();
        const authHeader = req.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token) as JWTPayload;

        if (!decoded?.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const data = await req.json() as NoteInput & { id: string };
        
        if (!data.id) {
            return NextResponse.json(
                { error: 'Note ID is required' },
                { status: 400 }
            );
        }

        const updatedNote = await Note.findOneAndUpdate(
            { 
                _id: data.id,
                userId: decoded.userId
            },
            {
                title: data.title,
                content: data.content
            },
            { new: true }
        ).lean<LeanNote>();

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