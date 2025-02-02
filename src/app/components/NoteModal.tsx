"use client"

import { useState, useRef } from "react"
import { Star, Share2, X, Play, Pause, Download, Copy, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function NoteModal() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      audioRef.current.currentTime = pos * audioRef.current.duration
    }
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Engineering Assignment Audio</CardTitle>
          <p className="text-sm text-muted-foreground">30 January 2025 · 05:26 PM</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Star className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            src="/sample-audio.mp3"
          />
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handlePlayPause} className="h-8 w-8">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div
              ref={progressRef}
              onClick={handleProgressClick}
              className="relative flex-1 h-1 bg-secondary cursor-pointer rounded-full"
            >
              <div
                className="absolute h-full bg-primary rounded-full"
                style={{
                  width: `${(currentTime / duration) * 100}%`,
                }}
              />
              <div
                className="absolute h-3 w-3 bg-primary rounded-full -top-1"
                style={{
                  left: `${(currentTime / duration) * 100}%`,
                  transform: "translateX(-50%)",
                }}
              />
            </div>
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
            <p className="text-muted-foreground">
              I&apos;m recording an audio to transcribe into text for the assignment of engineering in terms of actors.
            </p>
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
  )
}