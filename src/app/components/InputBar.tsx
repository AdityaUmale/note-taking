"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PenLine, ImageIcon, Mic, Square } from "lucide-react";
import { Send } from "lucide-react"; // Add this import

// Add this type for the props
interface InputBarProps {
  onSubmit: (note: { title: string; content: string }) => void;
}

export default function InputBar({ onSubmit }: InputBarProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognizer = new SpeechRecognition();
        recognizer.continuous = true;
        recognizer.interimResults = false;
        recognizer.lang = "en-US";

        recognizer.onresult = (event: any) => {
          let current = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setTranscript(prev => prev + current);
        };

        recognizer.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsRecording(false);
        };

        recognizer.onend = () => {
          setIsRecording(false);
        };

        setRecognition(recognizer);
      }
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognition?.stop();
    } else {
      setTranscript(""); // Clear previous transcript
      recognition?.start();
    }
    setIsRecording(!isRecording);
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      // Create a title from the first few words
      const title = transcript.split(' ').slice(0, 5).join(' ');
      onSubmit({
        title: title + '...',
        content: transcript
      });
      setTranscript(''); // Clear the input after submission
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto rounded-3xl">
      <div className="flex items-center gap-2 p-2 px-3">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <PenLine className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <ImageIcon className="h-5 w-5" />
          </Button>
        </div>
        <Input
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          placeholder="Start typing..."
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground"
          onClick={handleSubmit}
        >
          <Send className="h-5 w-5" />
        </Button>
        <Button 
          className={`rounded-full px-6 gap-2 ${
            isRecording 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={toggleRecording}
        >
          {isRecording ? (
            <>
              <Square className="h-4 w-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Start Recording
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}