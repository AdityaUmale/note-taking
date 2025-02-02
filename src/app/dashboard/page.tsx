
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Home, Star } from 'lucide-react';
import { NoteCard } from '../components/NoteCard';
import  InputBar  from '../components/InputBar';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/sign-in');
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
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
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
              <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </button>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <NoteCard
                title="Engineering Assignment Audio"
                content="I'm recording an audio to transcribe into text for the assignment of engineering in terms of actors..."
                date={new Date('2025-01-30')}
                duration="00:09"
                isNew={true}
              />
              {/* Add more NoteCard components as needed */}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="bg-gray-50 mb-6">
         
            <InputBar />
        </div>
      </div>
    </div>
  );
}