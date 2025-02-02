import { MoreHorizontal, Play } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  title: string;
  content: string;
  date: Date;
  duration?: string;
  isNew?: boolean;
}

export function NoteCard({ title, content, date, duration, isNew }: NoteCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isNew && (
            <span className="bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded-full">
              NEW
            </span>
          )}
          <span className="text-sm text-gray-500">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        </div>
        {duration && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Play className="w-3 h-3" />
            {duration}
          </div>
        )}
      </div>

      <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{content}</p>

      <div className="flex items-center justify-between mt-4">
        <button 
          className="text-gray-400 hover:text-gray-600"
          title="More options"
          aria-label="More options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}