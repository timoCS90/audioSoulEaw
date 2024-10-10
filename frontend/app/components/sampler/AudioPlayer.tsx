"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

interface Track {
  title: string;
  artist: string;
  audioSrc: string;
}

const tracks: Track[] = [
  {
    title: "Synth Wave",
    artist: "Audio Soul",
    audioSrc: "/example.mp3", // Stellen Sie sicher, dass der Pfad korrekt ist
  },
  // Weitere Tracks können hier hinzugefügt werden
];

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleTrackChange = (direction: "next" | "prev") => {
    setCurrentTrack((prevTrack) => {
      if (direction === "next") {
        return (prevTrack + 1) % tracks.length;
      } else {
        return prevTrack === 0 ? tracks.length - 1 : prevTrack - 1;
      }
    });
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-min max-h-min bg-gradient-to-b from-[var(--primary)] via-transparent to-transparent border border-[var(--white)] rounded-lg shadow-lg p-6 hover:scale-105">
      <audio
        ref={audioRef}
        src={tracks[currentTrack].audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => handleTrackChange("next")}
      />
      <div className="mb-4">
        <h3 className="text-xl font-bold text-[var(--white)]">
          {tracks[currentTrack].title}
        </h3>
        <p className="text-[var(--white)]">{tracks[currentTrack].artist}</p>
      </div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => handleTrackChange("prev")}
          className="p-2 rounded-full bg-transparent ring-4 ring-[var(--white)] hover:bg-[var(--white)] hover:ring-[var(--primary)]  hover:shadow-lg transition-colors"
          aria-label="Vorheriger Track"
        >
          <SkipBack className="w-6 h-6 text-[var(--white)] hover:text-[var(--primary)]" />
        </button>
        <button
          onClick={togglePlay}
          className="p-4 rounded-full bg-transparent text-white ring-4 ring-[var(--white)] hover:bg-[var(--white)] hover:ring-[var(--primary)] hover:text-[var(--primary)] hover:shadow-lg transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8" />
          )}
        </button>
        <button
          onClick={() => handleTrackChange("next")}
          className="p-2 rounded-full bg-transparent text-white ring-4 ring-[var(--white)] hover:bg-[var(--white)] hover:ring-[var(--primary)]  hover:shadow-lg transition-colors  "
          aria-label="Nächster Track"
        >
          <SkipForward className="w-6 h-6 text-[var(--white)] hover:text-[var(--primary)]" />
        </button>
      </div>
      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => {
            if (audioRef.current) {
              audioRef.current.currentTime = Number(e.target.value);
            }
          }}
          className="w-full accent-[var(--fifth)]"
        />
        <div className="flex justify-between text-sm text- text-[var(--white)]">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-transparent hover:bg-[var(--white)] transition-colors mr-2"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-[var(--white)] hover:text-[var(--primary)]" />
          ) : (
            <Volume2 className="w-6 h-6 text-[var(--white)] hover:text-[var(--primary)]" />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full accent-[var(--fifth)] rounded-full"
        />
      </div>
    </div>
  );
}
