'use client';

import { Home, Star, Search, SortDesc } from 'lucide-react';
import { NoteCard } from '../components/NoteCard';
import InputBar from '../components/InputBar';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import NoteModal from '../components/NoteModal';

interface Note {
  title: string;
  content: string;
  date: Date;
  isNew?: boolean;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes');
        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        const data = await response.json();
        setNotes(data.map((note: Note) => ({
          ...note,
          date: new Date(note.date)
        })));
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, []);

  const handleNewNote = async (note: { title: string; content: string }) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      const savedNote = await response.json();
      const newNote = {
        ...savedNote,
        date: new Date(savedNote.date),
        isNew: true,
      };
      
      setNotes(prevNotes => [newNote, ...prevNotes]);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 p-4">
      {/* Sidebar */}
      <div className="w-80 bg-white border border-gray-200 rounded-2xl mr-4 p-2 mt-2 mb-3">
        <div className="p-4">
          <h1 className="text-xl font-bold text-purple-600">AI Notes</h1>
        </div>
        <nav className="mt-4">
          <div className="px-4 space-y-2">
            <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg">
              <Home className="w-4 h-4 mr-3" />
              Home
            </button>
            <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100">
              <Star className="w-4 h-4 mr-3" />
              Favourites
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Search and Sort Section */}
            <div className="flex items-center justify-between mb-12">
              <div className="relative flex-1 max-w-5xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search" 
                  className="pl-10 bg-white h-11"
                />
              </div>
              <Button variant="ghost" className="flex items-center gap-2 ml-2 h-12">
                <SortDesc className="h-4 w-4" />
                Sort
              </Button>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {notes.map((note, index) => (
                <NoteCard
                  key={index}
                  title={note.title}
                  content={note.content}
                  date={note.date}
                  isNew={note.isNew}
                  onClick={() => setSelectedNote(note)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="bg-gray-50 mb-6">
          <InputBar onSubmit={handleNewNote} />
        </div>
      </div>

      {/* Modal */}
      {selectedNote && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedNote(null);
          }}
        >
          <div className="w-[90%] max-w-3xl max-h-[90vh] overflow-auto z-50 modal-animation">
            <NoteModal
              note={selectedNote}
              onClose={() => setSelectedNote(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}