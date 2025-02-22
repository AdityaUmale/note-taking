"use client";

import { Home, Star, Search, SortDesc } from "lucide-react";
import { NoteCard } from "../components/NoteCard";
import InputBar from "../components/InputBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useMemo } from "react";
import NoteModal from "../components/NoteModal";

interface Note {
  id: string;
  title: string;
  content: string;
  date: Date;
  isNew?: boolean;
  isFavorite?: boolean;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalFullScreen, setIsModalFullScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNoteUpdate = (updatedNote: Note) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      )
    );
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/sign-in";
          return;
        }

        const response = await fetch("/api/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }
        const data = await response.json();
        setNotes(
          data.map(
            (note: {
              _id: string;
              title: string;
              content: string;
              date: string;
              isFavorite?: boolean;
            }) => ({
              id: note._id,
              title: note.title,
              content: note.content,
              date: new Date(note.date),
              isFavorite: note.isFavorite,
            })
          )
        );
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  const handleNewNote = async (note: { title: string; content: string }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/sign-in";
        return;
      }

      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(note),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      const savedNote = await response.json();
      const newNote = {
        ...savedNote,
        date: new Date(savedNote.date),
        isNew: true,
      };

      setNotes((prevNotes) => [newNote, ...prevNotes]);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const toggleModalFullScreen = () => {
    setIsModalFullScreen((prev) => !prev);
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      if (!noteId) {
        console.error('Note ID is missing');
        return;
      }
  
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/sign-in';
        return;
      }
  
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
  
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleRenameNote = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    const newTitle = window.prompt("Enter new title:", note.title);
    if (!newTitle || newTitle === note.title) return;

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to rename note");
      }

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, title: newTitle } : note
        )
      );
    } catch (error) {
      console.error("Error renaming note:", error);
    }
  };

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // Add this line

  // Update the filteredNotes memo to include sorting
  const filteredNotes = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );

    return filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.date.getTime() - b.date.getTime();
      }
      return b.date.getTime() - a.date.getTime();
    });
  }, [notes, searchQuery, sortOrder]);

  // Add toggle sort function
  const toggleSort = () => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
  };

  // Update the Sort button in the JSX
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
            {/* Search Section */}
            <div className="flex items-center justify-between mb-12">
              <div className="relative flex-1 max-w-5xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notes..."
                  className="pl-10 bg-white h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                className="flex items-center gap-2 ml-2 h-12"
                onClick={toggleSort}
              >
                <SortDesc className={`h-4 w-4 transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                Sort {sortOrder === 'asc' ? 'Oldest' : 'Newest'}
              </Button>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <NoteCard
                  note={note}
                  key={note.id}
                  id={note.id}
                  title={note.title}
                  content={note.content}
                  date={note.date}
                  isNew={note.isNew}
                  onClick={() => setSelectedNote(note)}
                  onDelete={() => handleDeleteNote(note.id)}
                  onRename={() => handleRenameNote(note.id)}
                />
              ))}
              {filteredNotes.length === 0 && searchQuery && (
                <div className="col-span-full text-center text-gray-500 py-8">
                  No notes found matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="bg-gray-50 mb-6">
          <InputBar onSubmit={handleNewNote} />
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedNote && (
        <div
          className={
            isModalFullScreen
              ? "fixed inset-0 z-40"
              : "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center"
          }
          onClick={(e) => {
            if (!isModalFullScreen && e.target === e.currentTarget) {
              setSelectedNote(null);
            }
          }}
        >
          <div
            className={
              isModalFullScreen
                ? "w-full h-full"
                : "w-[90%] max-w-3xl max-h-[90vh] overflow-auto"
            }
          >
            <NoteModal
              note={selectedNote}
              onClose={() => {
                setSelectedNote(null);
                setIsModalFullScreen(false);
              }}
              toggleFullScreen={toggleModalFullScreen}
              isFullScreen={isModalFullScreen}
              onUpdate={handleNoteUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
}