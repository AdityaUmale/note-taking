// NoteModal.tsx
"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface NoteModalProps {
  note: {
    title: string;
    content: string;
    date: Date;
  };
  onClose: () => void;
  toggleFullScreen: () => void;
  isFullScreen: boolean;
}

export default function NoteModal({ note, onClose, toggleFullScreen }: NoteModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    // (Assuming you want to implement play/pause functionality later)
    setIsPlaying((prev) => !prev);
  };

  return (
    <Card className="max-w-3xl mx-auto h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {/* Fullscreen toggle button */}
          <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
            <Maximize2 className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <CardTitle>{note.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {note.date.toLocaleDateString()} · {note.date.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Star className="h-4 w-4" />
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
        {/* Audio controls (sample implementation) */}
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handlePlayPause} className="h-8 w-8">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1 bg-secondary h-1 rounded-full" />
            <div className="flex items-center gap-2 min-w-[140px]">
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
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
