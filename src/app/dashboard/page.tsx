
'use client';

import { Home, Star } from 'lucide-react';
import { NoteCard } from '../components/NoteCard';
import  InputBar  from '../components/InputBar';
import { Search, SortDesc } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

interface Note {
  title: string;
  content: string;
  date: Date;
  isNew?: boolean;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);

  const handleNewNote = (note: { title: string; content: string }) => {
    const newNote = {
      ...note,
      date: new Date(),
      isNew: true,
    };
    setNotes(prevNotes => [newNote, ...prevNotes]);
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
    </div>
  );
}