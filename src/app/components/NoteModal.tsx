"use client";

import { useState, useRef } from "react";
import {
  Star,
  Share2,
  X,
  Play,
  Pause,
  Download,
  Copy,
  ChevronLeft,
  ChevronRight,
  Plus,
  Maximize2,
  Check,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "@/components/ui/input";

interface Note {
  id: string;
  title: string;
  content: string;
  date: Date;
  isFavorite?: boolean;
}

interface NoteModalProps {
  note: Note;
  onClose: () => void;
  toggleFullScreen: () => void;
  onUpdate?: (note: Note) => void;
  isFullScreen: boolean;
}

export default function NoteModal({
  note,
  onClose,
  toggleFullScreen,
  onUpdate,
}: NoteModalProps) {
  const [isFavorite, setIsFavorite] = useState(note.isFavorite || false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFavoriteClick = async () => {
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isFavorite: !isFavorite,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }

      setIsFavorite(!isFavorite);
      if (onUpdate) {
        onUpdate({ ...note, isFavorite: !isFavorite });
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({
    title: note.title,
    content: note.content,
  });

  const handleEdit = async () => {
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedNote),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      if (onUpdate) {
        onUpdate({ ...note, ...editedNote });
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
            <Maximize2 className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            {isEditing ? (
              <Input
                value={editedNote.title}
                onChange={(e) =>
                  setEditedNote({ ...editedNote, title: e.target.value })
                }
                className="font-semibold text-xl"
              />
            ) : (
              <CardTitle>{note.title}</CardTitle>
            )}
            <p className="text-sm text-muted-foreground">
              {note.date.toLocaleDateString()} ·{" "}
              {note.date.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleEdit}>
                <Check className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={handleFavoriteClick}>
            <Star
              className={`h-4 w-4 ${isFavorite ? "fill-yellow-400" : ""}`}
            />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <Textarea
            value={editedNote.content}
            onChange={(e) =>
              setEditedNote({ ...editedNote, content: e.target.value })
            }
            className="min-h-[200px]"
          />
        ) : (
          <p className="text-muted-foreground">{note.content}</p>
        )}
        {/* Audio controls */}
        <div className="space-y-2">
          <audio ref={audioRef} style={{ display: "none" }} />
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlayPause}
              className="h-8 w-8"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <div className="flex-1 bg-secondary h-1 rounded-full" />
            <div className="flex items-center gap-2 min-w-[140px]">
              <span className="text-sm">00:00 / 00:00</span>
              <Button variant="ghost" size="sm" className="h-8">
                <Download className="h-4 w-4 mr-2" />
                Download Audio
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="transcript" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="speaker">Speaker Transcript</TabsTrigger>
          </TabsList>
          <TabsContent value="transcript" className="space-y-4">
            <div className="flex justify-between items-center pt-4">
              <h3 className="text-lg font-semibold">Transcript</h3>
              <Button variant="ghost" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <p className="text-muted-foreground">{note.content}</p>
            <Button variant="link" className="px-0">
              Read More
            </Button>

            <div className="flex items-start gap-4 pt-4">
              <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-02%20at%209.22.10%E2%80%AFPM-UO4XslW7mr9LIeXrKYPPgRRPN9adKq.png"
                  alt="Robot arm icon"
                  className="w-12 h-12"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Image
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
