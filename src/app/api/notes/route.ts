import { connectDB } from '../../lib/db';
import Note from '@/models/Note';
import { NextResponse } from 'next/server';

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
    const notes = await Note.find().sort({ date: -1 });
    return NextResponse.json(notes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}