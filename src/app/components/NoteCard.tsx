import { Copy, Edit2, MoreHorizontal, Play, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NoteCardProps {
  title: string;
  content: string;
  date: Date;
  duration?: string;
  isNew?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onRename?: () => void;
}

export function NoteCard({ 
  title, 
  content, 
  date, 
  duration, 
  isNew, 
  onClick,
  onDelete,
  onRename 
}: NoteCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
      onClick={onClick}
    >
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
      
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 mt-4">
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 bg-white hover:bg-gray-50 ${
            copied ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'
          }`}
          onClick={handleCopyToClipboard}
        >
          <Copy className="w-4 h-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onRename?.();
            }}>
              <Edit2 className="mr-2 h-4 w-4" />
              Rename note
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete note
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}