import { Copy, Edit2, MoreHorizontal, Play, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  date: Date;
  isFavorite?: boolean;
}

interface NoteCardProps {
  note: Note;
  id: string;
  content: string;
  date: Date;
  title: string;
  duration?: string;
  isNew?: boolean;
  onClick?: () => void;
  onDelete?: (id: string) => void;
  onRename?: (id: string, newTitle: string) => void;
}

export function NoteCard({
  note,
  duration,
  isNew,
  onClick,
  onDelete,
  onRename,
}: NoteCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(note.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && note.id) {
      onDelete(note.id);
    }
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRename && note.id) {
      // You could implement a modal or inline editing here
      const newTitle = prompt("Enter new title:", note.title);
      if (newTitle && newTitle !== note.title) {
        onRename(note.id, newTitle);
      }
    }
  };

  return (
    <div
      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
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
            {formatDistanceToNow(note.date, { addSuffix: true })}
          </span>
        </div>
        {duration && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Play className="w-3 h-3" />
            {duration}
          </div>
        )}
      </div>
      <h3 className="font-medium text-gray-900 mb-1">{note.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{note.content}</p>

      <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${
            copied ? "text-green-500" : "text-gray-400 hover:text-gray-600"
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
              className="h-8 w-8 text-gray-400 hover:text-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleRename}>
              <Edit2 className="mr-2 h-4 w-4" />
              Rename note
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={handleDelete}
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
