"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PenLine, ImageIcon, Mic, Square, Send } from "lucide-react";

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface InputBarProps {
  onSubmit: (note: { title: string; content: string }) => void;
}

export default function InputBar({ onSubmit }: InputBarProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Use the browser's SpeechRecognition implementation if available.
      const SpeechRecognitionConstructor =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionConstructor) {
        const recognizer: SpeechRecognition =
          new SpeechRecognitionConstructor();
        recognizer.continuous = true;
        recognizer.interimResults = false;
        recognizer.lang = "en-US";

        recognizer.onresult = (event: SpeechRecognitionEvent) => {
          let current = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setTranscript((prev) => prev + current);
        };

        recognizer.onerror = (event: SpeechRecognitionErrorEvent) => {
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
      setTranscript("");
      recognition?.start();
    }
    setIsRecording((prev) => !prev);
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      const title = transcript.split(" ").slice(0, 5).join(" ");
      onSubmit({
        title: title + "...",
        content: transcript,
      });
      setTranscript("");
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto rounded-3xl">
      <div className="flex items-center gap-2 p-2 px-3">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground"
          >
            <PenLine className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground"
          >
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
